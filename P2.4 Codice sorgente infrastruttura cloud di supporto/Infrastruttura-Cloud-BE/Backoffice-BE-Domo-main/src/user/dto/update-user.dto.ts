import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IUpdateUser } from "@visioscientiae/backoffice-packages-domo";

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['role'])) implements IUpdateUser {}
