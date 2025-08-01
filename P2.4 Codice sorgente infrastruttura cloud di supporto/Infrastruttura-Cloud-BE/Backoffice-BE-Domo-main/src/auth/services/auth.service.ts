import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto.';
import { ILoggedUser, UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from 'src/shared/services/hash.service';
import CustomUnauthorizedException from 'src/exceptions/unauthorized-exception';
import { JwtService } from '@nestjs/jwt';
import { JobOperator } from 'src/job/entities/job-operator.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(JobOperator) private jobOperatorRepository: Repository<JobOperator>,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ILoggedUser> {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user)
      throw new CustomUnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.hashService.compare(user.password, loginDto.password);
    if (!isPasswordValid)
      throw new CustomUnauthorizedException('Invalid credentials');

    const paypload = { id: user.id, email: user.email, role: user.role };
    const jwtToken = this.jwtService.sign(paypload);

    return { user: { id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt }, token: jwtToken } as ILoggedUser;
  }
}
