import { Injectable } from "@nestjs/common";
import { Paginated } from "nestjs-paginate";
import { PersonalProtectiveEquipment } from "../entities/ppe.entity";
import { FindPPEDto } from "../dto/find-ppe.dto";
import { UserSanitizerService } from "../../user/services/user-sanitizer.service";

@Injectable()
export class PPESanitizerService {
    constructor(
        private userSanitizerService: UserSanitizerService
    ) {}

    sanitizePPE(ppe: PersonalProtectiveEquipment): FindPPEDto {
        return {
            id: ppe.id,
            name: ppe.name,
            type: ppe.type,
            available: ppe.available,
            userId: ppe.userId,
            createdAt: ppe.createdAt,
            updatedAt: ppe.updatedAt,
            belongsTo: ppe.belongsTo ? this.userSanitizerService.sanitizeUser(ppe.belongsTo) : undefined
        }
    }

    sanitizePPEs(ppes: PersonalProtectiveEquipment[]): FindPPEDto[] {
        return ppes.map(ppe => this.sanitizePPE(ppe));
    }
    
    sanitizePaginatedPPEs(paginatedPPEs: Paginated<PersonalProtectiveEquipment>): Paginated<FindPPEDto> {
        return {
            ...paginatedPPEs,
            data: this.sanitizePPEs(paginatedPPEs.data)
        } as Paginated<FindPPEDto>;
    }
}