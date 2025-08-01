import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";

export const environmentPermissions = {
    create: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER],
    findPaginated: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER, UserRoleEnum.TEAM_LEADER],
    findOne: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER, UserRoleEnum.TEAM_LEADER],
    update: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER],
    remove: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER],
};