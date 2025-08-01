import { Injectable } from '@nestjs/common';
import { CreateEnvironmentDto } from '../dto/create-environment.dto';
import { UpdateEnvironmentDto } from '../dto/update-environment.dto';
import { Environment } from '../entities/environment.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { environmentPaginateConfig } from '../environment.paginate.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import AlreadyExistsException from 'src/exceptions/already-exists.exception';
import EntryNotFoundException from 'src/exceptions/not-found.exception';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectRepository(Environment) private environmentRepository: Repository<Environment>,
    private configService: ConfigService
  ) {}

  async create(createEnvironmentDto: CreateEnvironmentDto): Promise<Environment> {
    const checkEnvironment = await this.environmentRepository.findOne({ where: { name: createEnvironmentDto.name }});
    if(checkEnvironment)
      throw new AlreadyExistsException('Environment', createEnvironmentDto.name);

    return await this.environmentRepository.save(createEnvironmentDto);
  }

  async findPaginated(query: PaginateQuery): Promise<Paginated<Environment>> {
    return await paginate(query, this.environmentRepository, environmentPaginateConfig(this.configService));
  }

  async findOne(id: string): Promise<Environment> {
    const checkEnvironment = await this.environmentRepository.findOne({ where: { id: id }});
    if(!checkEnvironment)
      throw new EntryNotFoundException('Environment', id);

    return checkEnvironment;
  }

  async update(id: string, updateEnvironmentDto: UpdateEnvironmentDto): Promise<Environment> {
    const checkEnvironment = await this.environmentRepository.findOne({ where: { id: id }});
    if(!checkEnvironment)
      throw new EntryNotFoundException('Environment', id);

    if(updateEnvironmentDto.name && updateEnvironmentDto.name !== checkEnvironment.name) {
      const checkName = await this.environmentRepository.findOne({ where: { name: updateEnvironmentDto.name }});
      if(checkName)
        throw new AlreadyExistsException('Environment', updateEnvironmentDto.name);
    }

    const updateEnvironment = await this.environmentRepository.save({ ...checkEnvironment, ...updateEnvironmentDto });
    return await this.environmentRepository.findOne({ where: { id: updateEnvironment.id }});
  }

  async remove(id: string): Promise<Environment> {
    const checkEnvironment = await this.environmentRepository.findOne({ where: { id: id }});
    if(!checkEnvironment)
      throw new EntryNotFoundException('Environment', id);

    await this.environmentRepository.remove(checkEnvironment);
    return checkEnvironment;
  }
}
