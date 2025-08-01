import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";

export const environmentEventPermissions = {
    findPaginated: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER],
    findOne: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER],
};