import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEnvironmentDto } from './create-environment.dto';
import { IUpdateEnvironment } from '@visioscientiae/backoffice-packages-domo';

export class UpdateEnvironmentDto extends PartialType(OmitType(CreateEnvironmentDto, ['type'])) implements IUpdateEnvironment {}
