import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import EntryNotFoundException from "src/exceptions/not-found.exception";
import { Any, In, IsNull, Not, Repository } from "typeorm";
import { JobOperator } from "src/job/entities/job-operator.entity";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserService } from "./user.service";
import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";
import { paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import { userPaginateConfig } from "../user.paginate.config";
import { ConfigService } from "@nestjs/config";
import { FindOperatorWithJobsDto } from "../dto/find-user.dto";
import { OperatorSanitizerService } from "./operator-sanitizer.service";
import { Job } from "src/job/entities/job.entity";
import { JobSanitizerService } from "src/job/services/job-sanitizer.service";

@Injectable()
export class OperatorService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(JobOperator) private jobOperatorRepository: Repository<JobOperator>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private operatorSanitizer: OperatorSanitizerService,
    private jobSanitizer: JobSanitizerService
  ) {}

  async findPaginatedOperatorsWithJobs(query: PaginateQuery): Promise<Paginated<FindOperatorWithJobsDto>> {
    const paginateConfig = userPaginateConfig(this.configService);
    const operatorsIds = [];

    const data = this.operatorSanitizer.sanitizePaginatedOperatorsWithJobs(await paginate(query, this.userRepository, paginateConfig));
    
    data.data.map(operator => {operatorsIds.push(operator.id)});

    const operatorsJobs = await this.jobRepository.find({ where: {endDate: IsNull()}, relations: ['operatorsList', 'operatorsList.operator']});

    data.data.map(operator => {      
      const job = operatorsJobs.find(job => job.operatorsList.some(jobOperator => jobOperator.operator.id === operator.id));

      if (job) {
        operator.currentJob = this.jobSanitizer.sanitizeJob(job);
        delete operator.currentJob.operatorsList;
      }
    });

    return data;
  }

  async findPaginatedFreeOperators(query: PaginateQuery): Promise<Paginated<User>> {
    const paginateConfig = userPaginateConfig(this.configService);
    paginateConfig.relations = ['jobsProfiles', 'jobsProfiles.job', 'ppeList'];

    const openJobOperators = await this.jobOperatorRepository.find({ where: [{ closedJob: false, confirmed: IsNull() }, { closedJob: false, confirmed: true }], relations: ['operator'] });
    console.log("🚀 ~ OperatorService ~ findPaginatedFreeOperators ~ openJobOperators:", openJobOperators)
    const operatorsIds = openJobOperators.map(jobOperator => jobOperator.operator.id);
  
    paginateConfig.where = [
      {
        jobsProfiles: { id: IsNull() },
      },
      {
        id: Not(In(operatorsIds)),
      }
    ];

    return await paginate(query, this.userRepository, paginateConfig);
  }

  async findOneOperator(id: string): Promise<User> {
    const checkUser = await this.userRepository.findOne({ where: { id: id }});
    if(!checkUser || checkUser.role !== UserRoleEnum.OPERATOR)
      throw new EntryNotFoundException('User', id);

    return await this.userService.findOne(id);
  }

  async updateOperator(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const checkUser = await this.userRepository.findOne({ where: { id: id }});
    if(!checkUser || checkUser.role !== UserRoleEnum.OPERATOR)
      throw new EntryNotFoundException('User', id);

    return await this.userService.update(id, updateUserDto);
  }

  async removeOperator(id: string): Promise<User> {
    const checkUser = await this.userRepository.findOne({ where: { id: id }});
    if(!checkUser || checkUser.role !== UserRoleEnum.OPERATOR)
      throw new EntryNotFoundException('User', id);

    return await this.userService.remove(id);
  }
}
