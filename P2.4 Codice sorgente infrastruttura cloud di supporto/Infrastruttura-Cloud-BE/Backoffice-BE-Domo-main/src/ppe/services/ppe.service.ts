import { Injectable } from '@nestjs/common';
import { CreatePPEDto } from '../dto/create-ppe.dto';
import { UpdatePPEDto } from '../dto/update-ppe.dto';
import { PersonalProtectiveEquipment } from '../entities/ppe.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AlreadyExistsException from '../../exceptions/already-exists.exception';
import { ppePaginateConfig } from '../ppe.paginate.config';
import { ConfigService } from '@nestjs/config';
import EntryNotFoundException from 'src/exceptions/not-found.exception';
import { User } from 'src/user/entities/user.entity';
import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";
import CustomBadRequestException from 'src/exceptions/conflicting-relation.exception';

@Injectable()
export class PPEService {
  constructor(
    @InjectRepository(PersonalProtectiveEquipment) private ppeRepository: Repository<PersonalProtectiveEquipment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createPPEDto: CreatePPEDto): Promise<PersonalProtectiveEquipment> {
    const checkPPE = await this.ppeRepository.findOne({ where: { name: createPPEDto.name }});
    if(checkPPE)
      throw new AlreadyExistsException('Personal Protective Equipment', createPPEDto.name);

    if(createPPEDto.userId) {
      const checkUser = await this.userRepository.findOne({ where: { id: createPPEDto.userId }});
      if(!checkUser)
        throw new EntryNotFoundException('User', createPPEDto.userId);
      else if(checkUser.role !== UserRoleEnum.OPERATOR)
        throw new CustomBadRequestException('The userId provided does not belong to an operator');
    }

    const createdPPE = await this.ppeRepository.save(createPPEDto);
    return await this.ppeRepository.findOne({ where: { id: createdPPE.id }, relations: ['belongsTo'] });
  }

  async findPaginated(query: PaginateQuery): Promise<Paginated<PersonalProtectiveEquipment>> {
    return await paginate(query, this.ppeRepository, ppePaginateConfig(this.configService));
  }

  async findOne(id: string): Promise<PersonalProtectiveEquipment> {
    const checkPPE = await this.ppeRepository.findOne({ where: { id: id }, relations: ['belongsTo'] });
    if(!checkPPE)
      throw new EntryNotFoundException('Personal Protective Equipment', id);

    return checkPPE;
  }

  async findRelatedByMe(query: PaginateQuery, userId: string): Promise<Paginated<PersonalProtectiveEquipment>> {
    const checkUser = await this.userRepository.findOne({ where: { id: userId }});
    if(!checkUser || checkUser.role !== UserRoleEnum.OPERATOR)
      throw new EntryNotFoundException('User', userId);

    const paginateConfig = ppePaginateConfig(this.configService);
    paginateConfig.relations = [];
    paginateConfig.where = { userId: userId };

    return await paginate(query, this.ppeRepository, paginateConfig);
  }

  async update(id: string, updatePPEDto: UpdatePPEDto): Promise<PersonalProtectiveEquipment> {
    const checkPPE = await this.ppeRepository.findOne({ where: { id: id }});
    if(!checkPPE)
      throw new EntryNotFoundException('Personal Protective Equipment', id);

    if(updatePPEDto.name && updatePPEDto.name !== checkPPE.name) {
      const checkPPEName = await this.ppeRepository.findOne({ where: { name: updatePPEDto.name }});
      if(checkPPEName)
        throw new AlreadyExistsException('Personal Protective Equipment', updatePPEDto.name);
    }

    if(updatePPEDto.userId && updatePPEDto.userId !== checkPPE.userId) {
      const checkUser = await this.userRepository.findOne({ where: { id: updatePPEDto.userId }});
      if(!checkUser)
        throw new EntryNotFoundException('User', updatePPEDto.userId);
      else if(checkUser.role !== UserRoleEnum.OPERATOR)
        throw new CustomBadRequestException('The userId provided does not belong to an operator');
    }

    const updatedPPE = await this.ppeRepository.save({ ...checkPPE, ...updatePPEDto });
    return await this.ppeRepository.findOne({ where: { id: updatedPPE.id }, relations: ['belongsTo'] });
  }

  async remove(id: string): Promise<PersonalProtectiveEquipment> {
    const checkPPE = await this.ppeRepository.findOne({ where: { id: id }});
    if(!checkPPE)
      throw new EntryNotFoundException('Personal Protective Equipment', id);

    await this.ppeRepository.remove(checkPPE);
    return checkPPE;
  }
}
