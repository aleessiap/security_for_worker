import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import AlreadyExistsException from '../../exceptions/already-exists.exception';
import EntryNotFoundException from '../../exceptions/not-found.exception';
import { HashService } from '../../shared/services/hash.service';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { userPaginateConfig } from '../user.paginate.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private hashService: HashService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const checkUser = await this.userRepository.findOne({ where: { email: createUserDto.email }});
    if(checkUser)
      throw new AlreadyExistsException('User', createUserDto.email);

    const hashedPassword = await this.hashService.hash(createUserDto.password);
    createUserDto.password = hashedPassword;

    return await this.userRepository.save(createUserDto);
  }

  async findPaginated(query: PaginateQuery): Promise<Paginated<User>> {
    return await paginate(query, this.userRepository, userPaginateConfig(this.configService));
  }

  async findOne(id: string): Promise<User> {
    const checkUser = await this.userRepository.findOne({ where: { id: id }});
    if(!checkUser)
      throw new EntryNotFoundException('User', id);

    return checkUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const checkUser = await this.userRepository.findOne({ where: { id: id }});
    if(!checkUser)
      throw new EntryNotFoundException('User', id);

    if(updateUserDto.email) {
      const checkEmail = await this.userRepository.findOne({ where: { email: updateUserDto.email }});
      if(checkEmail && checkEmail.id !== id)
        throw new AlreadyExistsException('User', updateUserDto.email);
    }

    if(updateUserDto.password) {
      const hashedPassword = await this.hashService.hash(updateUserDto.password);
      updateUserDto.password = hashedPassword;
    }

    return await this.userRepository.save({ ...checkUser, ...updateUserDto });
  }

  async remove(id: string): Promise<User> {
    const checkUser = await this.userRepository.findOne({ where: { id: id }});
    if(!checkUser)
      throw new EntryNotFoundException('User', id);

    await this.userRepository.remove(checkUser);
    return checkUser;
  }
}
