import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";

export const userPermissions = {
    create: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN],
    findPaginated: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN],
    findOne: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN],
    update: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN],
    remove: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN],

    createOperator: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER],
    findPaginatedOperator: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER, UserRoleEnum.TEAM_LEADER],
    findOneOperator: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER, UserRoleEnum.TEAM_LEADER],
    updateOperator: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER],
    removeOperator: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER]

};