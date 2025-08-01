import { EventTypeEnum, IotDeviceTypeEnum, PPETypeEnum, UserRoleEnum } from "@visioscientiae/backoffice-packages-domo"
import { EnvironmentTypeEnum } from "@visioscientiae/backoffice-packages-domo/lib/esm/environment.interface"

export const getUserRoleEnum = (userType: UserRoleEnum): string => {
    switch(userType) {
        case UserRoleEnum.COMPANY_ADMIN:
            return 'company_admin.png'
        case UserRoleEnum.SUPER_ADMIN:
            return 'super_admin.png'
        case UserRoleEnum.SAFETY_MANAGER:
            return 'safety_manager.png'
        case UserRoleEnum.OPERATOR:
            return 'operator.png'
        case UserRoleEnum.TEAM_LEADER:
            return 'team_leader.png'
    }
}

export const getPPETypeIcon = (ppeType: PPETypeEnum): string => {
    switch(ppeType) {
        case PPETypeEnum.HARD_HAT:
            return 'hard_hat.png'
        case PPETypeEnum.SAFETY_SHOES:
            return 'safety_shoes.png'
        case PPETypeEnum.GLOVES:
            return 'gloves.png'
        case PPETypeEnum.SAFETY_GLASSES:
            return 'safety_glasses.png'
        case PPETypeEnum.BELT:
            return 'belt.png'
        case PPETypeEnum.SAFETY_VEST:
            return 'safety_vest.png'
        case PPETypeEnum.SAFETY_HARNESS:
            return 'safety_harness.png'
        case PPETypeEnum.FACE_MASK:
            return 'face_mask.png'
        case PPETypeEnum.EAR_MUFF:
            return 'ear_muff.png'
        case PPETypeEnum.EAR_PLUGS:
            return 'ear_plugs.png'
        case PPETypeEnum.RESPIRATOR:
            return 'respirator.png'
    }
}

export const getIoTDeviceTypeIcon = (deviceType: IotDeviceTypeEnum): string => {
    switch(deviceType) {
        case IotDeviceTypeEnum.OPERATOR:
            return 'operator.png'
        case IotDeviceTypeEnum.ENVIROMENT:
            return 'environment.png'
        case IotDeviceTypeEnum.GATEWAY:
            return 'gateway.png'
    }
}

export const getEnvironmentTypeIcon = (environmentType: EnvironmentTypeEnum): string => {
    switch(environmentType) {
        case EnvironmentTypeEnum.INDOOR:
            return 'indoor.png'
        case EnvironmentTypeEnum.OUTDOOR:
            return 'outdoor.png'
    }
}

export const getEventTypeIcon = (eventType: EventTypeEnum): string => {
    switch(eventType) {
        case EventTypeEnum.FULLY_EQUIPPED:
            return 'fully_equipped.png'
        case EventTypeEnum.GAS_LEAK:
            return 'gas_leak.png'
        case EventTypeEnum.GOOD_AIR_QUALITY:
            return 'good_air_quality.png'
        case EventTypeEnum.LOW_AIR_QUALITY:
            return 'low_air_quality.png'
        case EventTypeEnum.NEAR_MISS:
            return 'near_miss.png'
        case EventTypeEnum.NOT_WEARING_HARD_HAT:
            return 'not_wearing_hard_hat.png'
        case EventTypeEnum.NOT_WEARING_SHOE1:
            return 'not_wearing_shoe1.png'
        case EventTypeEnum.NOT_WEARING_SHOE2:
            return 'not_wearing_shoe2.png'
        case EventTypeEnum.NO_DANGER:
            return 'no_danger.png'
        case EventTypeEnum.WILDFIRE:
            return 'wildfire.png'
    }
}