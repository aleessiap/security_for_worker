import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";

export const jobPermissions = {
    create: [UserRoleEnum.TEAM_LEADER],
    endJob: [UserRoleEnum.TEAM_LEADER],
    remove: [UserRoleEnum.TEAM_LEADER],

    confirmDenyJob: [UserRoleEnum.OPERATOR],

    getMyAssignedJob: [UserRoleEnum.OPERATOR],
    getMyPaginated: [UserRoleEnum.TEAM_LEADER],

    getPaginated: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER, UserRoleEnum.TEAM_LEADER],
    getJobById: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER]
};