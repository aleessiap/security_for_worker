import { Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from './shared/services/hash.service';
import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);
    
  constructor(
      @InjectRepository(User) private usersRepository: Repository<User>,
      private hashService: HashService,
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    const superUserCount = await this.usersRepository.count({ where: { role: UserRoleEnum.SUPER_ADMIN } });
    
    if (superUserCount === 0) {
        this.logger.log('No superuser found, creating one...');

        if(!process.env.SUPERUSER_EMAIL || !process.env.SUPERUSER_PASSWORD) {
            this.logger.error('SUPERUSER_EMAIL and/or SUPERUSER_PASSWORD not found in environment variables');
            process.exit(1);
        }

        const hashedPassword = await this.hashService.hash(process.env.SUPERUSER_PASSWORD);
        const createdUser = await this.usersRepository.save({email: process.env.SUPERUSER_EMAIL, password: hashedPassword, role: UserRoleEnum.SUPER_ADMIN});

        this.logger.log(`Superuser created: ${createdUser.email}`);
    } else {
        this.logger.log('Superuser found');
    }
  }
}
