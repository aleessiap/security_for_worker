import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";

export const operatorEventPermissions = {
    findPaginated: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER],
    findMyPaginated: [UserRoleEnum.OPERATOR],
    findOne: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER],
};