import { Injectable } from '@nestjs/common';
import { CreateEnvironmentEventDto } from '../dto/create-environment-event.dto';
import { EnvironmentEvent } from '../entities/environment-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Environment } from 'src/environment/entities/environment.entity';
import { ConfigService } from '@nestjs/config';
import EntryNotFoundException from 'src/exceptions/not-found.exception';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { environmentEventPaginateConfig } from '../environment-event.paginate.config';
import { IToken } from 'src/utils/config.interface';
import CustomBadRequestException from 'src/exceptions/conflicting-relation.exception';
import { Sensor } from 'src/sensor/entities/sensor.entity';
import { Job } from 'src/job/entities/job.entity';

@Injectable()
export class EnvironmentEventService {
  constructor(
    @InjectRepository(EnvironmentEvent) private environmentEventRepository: Repository<EnvironmentEvent>,
    @InjectRepository(Environment) private environmentRepository: Repository<Environment>,
    @InjectRepository(Sensor) private sensorRepository: Repository<Sensor>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    private configService: ConfigService
  ) {}

  async create(createEnvironmentEventDto: CreateEnvironmentEventDto): Promise<string>{
    const token = this.configService.get<IToken>('token');
    if(token.environmentEventToken !== createEnvironmentEventDto.token)
      throw new CustomBadRequestException('Invalid token');

    const checkSensor = await this.sensorRepository.findOne({ where: { identifierCode: createEnvironmentEventDto.sensorId }, relations: ['containedWithin', 'containedWithin.installedOnEnvironment'] });
    
    if(!checkSensor)
      throw new EntryNotFoundException('Sensor', createEnvironmentEventDto.sensorId);
    if(!checkSensor.containedWithin)
      throw new CustomBadRequestException('Sensor is not installed on any IoT Device');
    if(!checkSensor.containedWithin.installedOnEnvironment)
      throw new CustomBadRequestException(`IoT Device "${checkSensor.containedWithin.installedOnEnvironment}" is not installed on any Environment`);

    const checkEnvironment = await this.environmentRepository.findOne({ where: { id: checkSensor.containedWithin.installedOnEnvironment.id }});
    if(!checkEnvironment)
      throw new EntryNotFoundException('Environment', checkSensor.containedWithin.installedOnEnvironment.id);

    const openJobs = await this.jobRepository.find({ where: { endDate: null, aborted: false, environment: {id: checkEnvironment.id} }});
    if(!openJobs || openJobs.length === 0)
      throw new CustomBadRequestException(`Environment "${checkEnvironment.name}" does not have an open job`);

    await this.environmentEventRepository.save({
      environmentName: checkSensor.containedWithin.installedOnEnvironment.name,
      environmentType: checkSensor.containedWithin.installedOnEnvironment.type,
      eventType: createEnvironmentEventDto.eventType,
      timestamp: createEnvironmentEventDto.timestamp,
      environmentId: checkSensor.containedWithin.installedOnEnvironment.id,
      jobs: openJobs
    } as EnvironmentEvent);

    return 'Environment Event created successfully';
  }

  async findPaginated(query: PaginateQuery): Promise<Paginated<EnvironmentEvent>> {
    return await paginate(query, this.environmentEventRepository, environmentEventPaginateConfig(this.configService));
  }

  async findOne(id: string): Promise<EnvironmentEvent> {
    const checkEnvironmentEvent = await this.environmentEventRepository.findOne({ where: { id: id }, relations: ['emittedBy'] });
    if(!checkEnvironmentEvent)
      throw new EntryNotFoundException('Environment Event', id);

    return checkEnvironmentEvent;
  }
}
