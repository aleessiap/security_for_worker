import { Injectable } from '@nestjs/common';
import { CreateIotDeviceDto } from '../dto/create-iot-device.dto';
import { UpdateIotDeviceDto } from '../dto/update-iot-device.dto';
import { IotDevice } from '../entities/iot-device.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { iotDevicePaginateConfig } from '../iot-device.paginate.config';
import { ConfigService } from '@nestjs/config';
import EntryNotFoundException from 'src/exceptions/not-found.exception';
import { PersonalProtectiveEquipment } from 'src/ppe/entities/ppe.entity';
import CustomBadRequestException from 'src/exceptions/conflicting-relation.exception';
import AlreadyExistsException from 'src/exceptions/already-exists.exception';
import { Environment } from 'src/environment/entities/environment.entity';
import { IotDeviceTypeEnum } from '@visioscientiae/backoffice-packages-domo';

@Injectable()
export class IotDeviceService {
  constructor(
    @InjectRepository(IotDevice) private iotDeviceRepository: Repository<IotDevice>,
    @InjectRepository(PersonalProtectiveEquipment) private ppeRepository: Repository<PersonalProtectiveEquipment>,
    @InjectRepository(Environment) private environmentRepository: Repository<Environment>,
    private configService: ConfigService,
  ) {}

  async create(createIotDeviceDto: CreateIotDeviceDto): Promise<IotDevice> {
    const checkIoTDevice = await this.iotDeviceRepository.findOne({ where: { identifierCode: createIotDeviceDto.identifierCode }});
    if(checkIoTDevice)
      throw new AlreadyExistsException('IoT Device', createIotDeviceDto.identifierCode);

    if (createIotDeviceDto.ppeId && createIotDeviceDto.environmentId)
      throw new CustomBadRequestException('You cannot assign a PPE and an Environment at the same time');

    if(createIotDeviceDto.ppeId) {
      const checkPPE = await this.ppeRepository.findOne({ where: { id: createIotDeviceDto.ppeId }, relations: ['installedDevice']});

      if(!checkPPE)
        throw new EntryNotFoundException('Personal Protective Equipment', createIotDeviceDto.ppeId);
      else if(checkPPE.installedDevice)
        throw new CustomBadRequestException('The choosen PPE is already assigned to another IoT Device');
    } else if(createIotDeviceDto.environmentId) {
      const checkEnvironment = await this.environmentRepository.findOne({ where: { id: createIotDeviceDto.environmentId }, relations: ['installedDevice']});

      if(!checkEnvironment)
        throw new EntryNotFoundException('Environment', createIotDeviceDto.environmentId);
      else if(checkEnvironment.installedDevice)
        throw new CustomBadRequestException('The choosen Environment is already assigned to another IoT Device');
    }

    const createdIotDevice = await this.iotDeviceRepository.save(createIotDeviceDto);
    return await this.iotDeviceRepository.findOne({ where: { id: createdIotDevice.id }, relations: ['installedOnPPE', 'installedOnEnvironment'] });
  }

  async findPaginated(query: PaginateQuery): Promise<Paginated<IotDevice>> {
    return await paginate(query, this.iotDeviceRepository, iotDevicePaginateConfig(this.configService));
  }

  async findOne(id: string): Promise<IotDevice> {
    const checkIotDevice = await this.iotDeviceRepository.findOne({ where: { id: id }, relations: ['installedOnPPE', 'installedOnEnvironment'] });
    if(!checkIotDevice)
      throw new EntryNotFoundException('IoT Device', id);

    return checkIotDevice;
  }

  async update(id: string, updateIotDeviceDto: UpdateIotDeviceDto): Promise<IotDevice> {
    const checkIotDevice = await this.iotDeviceRepository.findOne({ where: { id: id }});
    if(!checkIotDevice)
      throw new EntryNotFoundException('IoT Device', id);

    if(updateIotDeviceDto.ppeId && updateIotDeviceDto.environmentId)
      throw new CustomBadRequestException('You cannot assign a PPE and an Environment at the same time');
    else if(updateIotDeviceDto.ppeId && checkIotDevice.type !== IotDeviceTypeEnum.OPERATOR)
      throw new CustomBadRequestException('You cannot assign a PPE to a non-Operator IoT Device');
    else if(updateIotDeviceDto.environmentId && checkIotDevice.type !== IotDeviceTypeEnum.ENVIROMENT)
      throw new CustomBadRequestException('You cannot assign an Environment to a non-Environment IoT Device');

    if(updateIotDeviceDto.ppeId && updateIotDeviceDto.ppeId !== checkIotDevice.ppeId) {
      const checkPPE = await this.ppeRepository.findOne({ where: { id: updateIotDeviceDto.ppeId }, relations: ['installedDevice']});
      if(!checkPPE)
        throw new EntryNotFoundException('Personal Protective Equipment', updateIotDeviceDto.ppeId);
      else if(checkPPE.installedDevice)
        throw new CustomBadRequestException('The choosen PPE is already assigned to another IoT Device');
    } else if(updateIotDeviceDto.environmentId && updateIotDeviceDto.environmentId !== checkIotDevice.environmentId) {
      const checkEnvironment = await this.environmentRepository.findOne({ where: { id: updateIotDeviceDto.environmentId }, relations: ['installedDevice']});
      if(!checkEnvironment)
        throw new EntryNotFoundException('Environment', updateIotDeviceDto.environmentId);
      else if(checkEnvironment.installedDevice)
        throw new CustomBadRequestException('The choosen Environment is already assigned to another IoT Device');
    }

    const updatedIotDevice = await this.iotDeviceRepository.save({ ...checkIotDevice, ...updateIotDeviceDto });
    return await this.iotDeviceRepository.findOne({ where: { id: updatedIotDevice.id }, relations: ['installedOnPPE', 'installedOnEnvironment'] });
  }

  async remove(id: string): Promise<IotDevice> {
    const checkIotDevice = await this.iotDeviceRepository.findOne({ where: { id: id }});
    if(!checkIotDevice)
      throw new EntryNotFoundException('IoT Device', id);

    await this.iotDeviceRepository.remove(checkIotDevice);
    return checkIotDevice;
  }
}
