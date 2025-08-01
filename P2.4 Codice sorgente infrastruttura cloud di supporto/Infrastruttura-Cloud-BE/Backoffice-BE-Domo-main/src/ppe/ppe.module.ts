import { Module } from '@nestjs/common';
import { PPEService } from './services/ppe.service';
import { PPEController } from './controllers/ppe.controller';
import { UserSanitizerService } from '../user/services/user-sanitizer.service';
import { PPESanitizerService } from './services/ppe-sanitizer.service';
import { PersonalProtectiveEquipment } from './entities/ppe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalProtectiveEquipment, User])],
  controllers: [PPEController],
  providers: [
    PPEService,
    PPESanitizerService,
    UserSanitizerService
  ],
})
export class PPEModule {}
