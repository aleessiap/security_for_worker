import { Injectable } from '@nestjs/common';
import { CreateOperatorEventDto } from '../dto/create-operator-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import EntryNotFoundException from 'src/exceptions/not-found.exception';
import { OperatorEvent } from '../entities/operator-event.entity';
import { UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { operatorEventPaginateConfig } from '../operator-event.paginate.config';
import CustomBadRequestException from 'src/exceptions/conflicting-relation.exception';
import { Sensor } from 'src/sensor/entities/sensor.entity';
import { IToken } from 'src/utils/config.interface';

@Injectable()
export class OperatorEventService {
  constructor(
    @InjectRepository(OperatorEvent) private operatorEventRepository: Repository<OperatorEvent>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Sensor) private sensorRepository: Repository<Sensor>,
    private configService: ConfigService
  ) {}

  async create(createOperatorEventDto: CreateOperatorEventDto): Promise<string> {
    const token = this.configService.get<IToken>('token');
    if(token.operatorEventToken !== createOperatorEventDto.token)
      throw new CustomBadRequestException('Invalid token');

    const checkSensor = await this.sensorRepository.findOne({ where: { identifierCode: createOperatorEventDto.sensorId }, relations: ['containedWithin', 'containedWithin.installedOnPPE', 'containedWithin.installedOnPPE.belongsTo'] });
    
    if(!checkSensor)
      throw new EntryNotFoundException('Sensor', createOperatorEventDto.sensorId);
    if(!checkSensor.containedWithin)
      throw new CustomBadRequestException('Sensor is not installed on any IoT Device');
    if(!checkSensor.containedWithin.installedOnPPE)
      throw new CustomBadRequestException(`IoT Device "${checkSensor.containedWithin.identifierCode}" is not installed on any PPE`);
    if(!checkSensor.containedWithin.installedOnPPE.belongsTo)
      throw new CustomBadRequestException(`PPEDevice "${checkSensor.containedWithin.installedOnPPE.name}" is not assigned to any Operator`);

    const checkOperator = await this.userRepository.findOne({ where: { id: checkSensor.containedWithin.installedOnPPE.belongsTo.id }, relations: ['jobsProfiles', 'jobsProfiles.job']});
    if(!checkOperator || checkOperator.role !== UserRoleEnum.OPERATOR)
      throw new EntryNotFoundException('Operator', checkSensor.containedWithin.installedOnPPE.belongsTo.id);
    
    const openJob = checkOperator.jobsProfiles.find(jobProfile => jobProfile.closedJob === false && jobProfile.confirmed !== false);
    if(!openJob)
      throw new CustomBadRequestException(`Operator "${checkOperator.email}" does not have an open job`);
    
    await this.operatorEventRepository.save({ 
      operatorName: checkSensor.containedWithin.installedOnPPE.belongsTo.name, 
      operatorSurname: checkSensor.containedWithin.installedOnPPE.belongsTo.surname,
      operatorEmailAddress: checkSensor.containedWithin.installedOnPPE.belongsTo.email,
      ppeType: checkSensor.containedWithin.installedOnPPE.type,
      eventType: createOperatorEventDto.eventType,
      timestamp: createOperatorEventDto.timestamp,
      operatorId: checkSensor.containedWithin.installedOnPPE.belongsTo.id,
      jobId: openJob.job.id,
    } as OperatorEvent);

    return 'Operator Event created successfully';
  }

  async findPaginated(query: PaginateQuery): Promise<Paginated<OperatorEvent>> {
    return await paginate(query, this.operatorEventRepository, operatorEventPaginateConfig(this.configService));
  }

  async findMyPaginated(query: PaginateQuery, userId: string): Promise<Paginated<OperatorEvent>> {
    const checkUser = await this.userRepository.findOne({ where: { id: userId }});
    if(!checkUser || checkUser.role !== UserRoleEnum.OPERATOR)
      throw new EntryNotFoundException('User', userId);

    const paginateConfig = operatorEventPaginateConfig(this.configService);
    paginateConfig.relations = ['job'];
    paginateConfig.where = { operatorId: userId };

    return await paginate(query, this.operatorEventRepository, paginateConfig);
  }

  async findOne(id: string): Promise<OperatorEvent> {
    const checkOperatorEvent = await this.operatorEventRepository.findOne({ where: { id: id }, relations: ['emittedBy'] });
    if(!checkOperatorEvent)
      throw new EntryNotFoundException('Operator Event', id);

    return checkOperatorEvent;
  }
}
