import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePPEDto } from './create-ppe.dto';
import { IUpdatePersonalProtectiveEquipment } from "@visioscientiae/backoffice-packages-domo";

export class UpdatePPEDto extends PartialType(OmitType(CreatePPEDto, ['type'])) implements IUpdatePersonalProtectiveEquipment {}
