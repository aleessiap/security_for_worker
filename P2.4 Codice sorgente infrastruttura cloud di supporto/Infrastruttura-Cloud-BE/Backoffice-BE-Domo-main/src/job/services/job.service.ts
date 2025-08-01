import { Injectable } from '@nestjs/common';
import { CreateJobDto } from '../dto/create-job.dto';
import { Job } from '../entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { JobOperator } from '../entities/job-operator.entity';
import { User } from 'src/user/entities/user.entity';
import { UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';
import MultipleEntriesNotFoundException from 'src/exceptions/multiple-not-found.exception';
import CustomBadRequestException from 'src/exceptions/conflicting-relation.exception';
import EntryNotFoundException from 'src/exceptions/not-found.exception';
import { Environment } from 'src/environment/entities/environment.entity';
import { PaginateQuery } from 'nestjs-paginate/lib/decorator';
import { paginate, Paginated } from 'nestjs-paginate';
import { jobPaginateConfig } from '../job.paginate.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(JobOperator) private jobOperatorRepository: Repository<JobOperator>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Environment) private environmentRepository: Repository<Environment>,
    private dataSource: DataSource,
    private configService: ConfigService
  ) {}

  async create(createJobDto: CreateJobDto, teamLeaderId: string): Promise<Job> {
    const operators = await this.userRepository.find({ where: {id: In(createJobDto.operatorsIdsList), role: UserRoleEnum.OPERATOR}, relations: ['ppeList', 'jobsProfiles'] });
    if(operators.length !== createJobDto.operatorsIdsList.length)
      throw new MultipleEntriesNotFoundException('Operators', createJobDto.operatorsIdsList.filter(id => !operators.map(operator => operator.id).includes(id)));

    if(operators.some(operator => operator.ppeList.length === 0))
      throw new CustomBadRequestException('Some operators have no PPE');

    if(operators.some(operator => operator.jobsProfiles.some(jobOperator => (jobOperator.closedJob === false && jobOperator.confirmed !== false))))
      throw new CustomBadRequestException('Some operators are already assigned to a job');

    const environment = await this.environmentRepository.findOne({ where: {id: createJobDto.environmentId} });
    if(!environment)
      throw new EntryNotFoundException('Environment', createJobDto.environmentId);

    const teamLeader = await this.userRepository.findOne({ where: {id: teamLeaderId, role: UserRoleEnum.TEAM_LEADER} });
    if(!teamLeader)
      throw new EntryNotFoundException('Team Leader', teamLeaderId);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const jobOperatorsToSave = operators.map(operator => {
        return new JobOperator({
          name: operator.name,
          surname: operator.surname,
          email: operator.email,
          operator: operator,
          closedJob: false
        });
      });

      const jobOperators = await queryRunner.manager.save(JobOperator, jobOperatorsToSave);

      const jobToSave = new Job({
        ...createJobDto,
        
        startDate: new Date(),

        environmentName: environment.name,
        environmentType: environment.type,

        creatorEmail: teamLeader.email,

        jobCreator: teamLeader,
        operatorsList: jobOperators,
        environment: environment,

        aborted: false
      });

      const job = await queryRunner.manager.save(Job, jobToSave);

      await queryRunner.commitTransaction();
      return job;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if(error instanceof MultipleEntriesNotFoundException)
        throw error;

    } finally {
        await queryRunner.release();
    }
  }

  async endJob(id: string, teamLeaderEmail: string): Promise<Job> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    const job = await queryRunner.manager.findOne(Job, { where: { id }, relations: ['operatorsList'] });
    if (!job || teamLeaderEmail !== job.creatorEmail)
      throw new EntryNotFoundException('Job', id);

    if (job.endDate)
      throw new CustomBadRequestException('Job already ended');

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      job.operatorsList.forEach(operator => operator.closedJob = true);
      await queryRunner.manager.save(job.operatorsList);

      job.endDate = new Date();

      const updatedJob = await queryRunner.manager.save(job);

      await queryRunner.commitTransaction();

      return updatedJob;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, teamLeaderEmail: string): Promise<Job> {
    const queryRunner = this.dataSource.createQueryRunner();

    const job = await this.jobRepository.findOne({ where: {id}, relations: ['operatorsList'] });
    if(!job || teamLeaderEmail !== job.creatorEmail)
      throw new EntryNotFoundException('Job', id);

    if(job.endDate)
      throw new CustomBadRequestException('Job already ended');

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      job.operatorsList.forEach(operator => operator.closedJob = true);
      await queryRunner.manager.save(job.operatorsList);

      job.aborted = true;
      job.endDate = new Date();

      const updatedJob = await queryRunner.manager.save(job);

      await queryRunner.commitTransaction();

      return updatedJob;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }

  async getMyPaginated(query: PaginateQuery, teamLeaderId: string): Promise<Paginated<Job>> {
    const teamLeader = await this.userRepository.findOne({ where: {id: teamLeaderId, role: UserRoleEnum.TEAM_LEADER} });
    if(!teamLeader)
      throw new EntryNotFoundException('Team Leader', teamLeaderId);

    const paginateConfig = jobPaginateConfig(this.configService);
    paginateConfig.where = { creatorEmail: teamLeader.email };

    return await paginate(query, this.jobRepository, paginateConfig);
  }

  async getPaginated(query: PaginateQuery): Promise<Paginated<Job>> {
    return await paginate(query, this.jobRepository, jobPaginateConfig(this.configService));
  }

  async getJobById(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: {id}, relations: ['operatorsList'] });
    if(!job)
      throw new EntryNotFoundException('Job', id);

    return job
  }

  async getMyAssignedJob(operatorId: string): Promise<Job> {
    const operator = await this.userRepository.findOne({ where: {id: operatorId, role: UserRoleEnum.OPERATOR} });
    if(!operator)
      throw new EntryNotFoundException('Operator', operatorId);

    const jobOperator = await this.jobOperatorRepository.findOne({ where: {job: {endDate: IsNull()}, operator: {id: operator.id}, confirmed: IsNull()}, relations: ['job'] });
    if(!jobOperator)
      throw new CustomBadRequestException('No job to confirm');

    return jobOperator.job;
  }

  async confirmDenyJob(operatorId: string, confirm: boolean): Promise<Job> {
    const operator = await this.userRepository.findOne({ where: {id: operatorId, role: UserRoleEnum.OPERATOR} });
    if(!operator)
      throw new EntryNotFoundException('Operator', operatorId);

    const jobOperator = await this.jobOperatorRepository.findOne({ where: {job: {endDate: IsNull()}, operator: {id: operator.id}}, relations: ['job'] });
    if(!jobOperator)
      throw new CustomBadRequestException('No job to confirm');

    if(jobOperator.job.endDate)
      throw new CustomBadRequestException('Job already ended');

    if(jobOperator.confirmed !== null)
      throw new CustomBadRequestException('Job already confirmed or denied');

    jobOperator.confirmed = confirm;

    await this.jobOperatorRepository.save(jobOperator);

    return jobOperator.job;
  }
}
