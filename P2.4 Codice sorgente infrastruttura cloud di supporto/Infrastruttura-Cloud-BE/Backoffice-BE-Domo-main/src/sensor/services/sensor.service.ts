import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { Sensor } from '../entities/sensor.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { sensorPaginateConfig } from '../sensor.paginate.config';
import EntryNotFoundException from 'src/exceptions/not-found.exception';
import { IotDevice } from 'src/iot-device/entities/iot-device.entity';
import AlreadyExistsException from 'src/exceptions/already-exists.exception';

@Injectable()
export class SensorService {
  constructor (
    @InjectRepository(Sensor) private sensorRepository: Repository<Sensor>,
    @InjectRepository(IotDevice) private iotDeviceRepository: Repository<IotDevice>,
    private configService: ConfigService
  ) {}

  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const checkSensor = await this.sensorRepository.findOne({ where: { identifierCode: createSensorDto.identifierCode } });
    if(checkSensor)
      throw new AlreadyExistsException('Sensor', createSensorDto.identifierCode);

    if(createSensorDto.iotDeviceId) {
      const checkIotDevice = await this.iotDeviceRepository.findOne({ where: { id: createSensorDto.iotDeviceId }});
      if(!checkIotDevice)
        throw new EntryNotFoundException('IoT Device', createSensorDto.iotDeviceId);
    }

    const createdSensor = await this.sensorRepository.save(createSensorDto);
    return await this.sensorRepository.findOne({ where: { id: createdSensor.id }, relations: ['containedWithin'] });
  }

  async findPaginated(query: PaginateQuery): Promise<Paginated<Sensor>> {
    return await paginate(query, this.sensorRepository, sensorPaginateConfig(this.configService));
  }

  async findOne(id: string): Promise<Sensor> {
    const checkSensor = await this.sensorRepository.findOne({ where: { id: id }, relations: ['containedWithin'] });
    if (!checkSensor)
      throw new EntryNotFoundException('Sensor', id);

    return checkSensor;
  }

  async update(id: string, updateSensorDto: UpdateSensorDto): Promise<Sensor> {
    const checkSensor = await this.sensorRepository.findOne({ where: { id: id } });
    if (!checkSensor)
      throw new EntryNotFoundException('Sensor', id);

    if (updateSensorDto.iotDeviceId && updateSensorDto.iotDeviceId !== checkSensor.iotDeviceId) {
      const checkIotDevice = await this.iotDeviceRepository.findOne({ where: { id: updateSensorDto.iotDeviceId } });
      if (!checkIotDevice)
        throw new EntryNotFoundException('IoT Device', updateSensorDto.iotDeviceId);
    }

    const updatedSensor = await this.sensorRepository.save({ ...checkSensor, ...updateSensorDto });
    return await this.sensorRepository.findOne({ where: { id: updatedSensor.id }, relations: ['containedWithin'] });
  }

  async remove(id: string): Promise<Sensor> {
    const checkSensor = await this.sensorRepository.findOne({ where: { id: id } });
    if(!checkSensor)
      throw new EntryNotFoundException('Sensor', id);

    await this.sensorRepository.remove(checkSensor);
    return checkSensor;
  }
}
