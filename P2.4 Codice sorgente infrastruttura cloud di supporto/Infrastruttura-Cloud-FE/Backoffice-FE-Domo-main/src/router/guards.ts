import { useAuthStore } from "@/stores/auth"
import { useIoTDeviceStore } from "@/stores/iot"
import { usePersonalProtectiveEquipmentStore } from "@/stores/ppe"
import { useSensorStore } from "@/stores/sensor"
import { useUserStore } from "@/stores/user"
import { RouteLocationNormalized } from "vue-router"

export const isLoggedGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if(!useAuthStore().isLogged() && to.name !== 'login')
        return { name: 'login' }
    else if (useAuthStore().isLogged() && to.name === 'login')
        return { name: 'dashboard' }
}

export const isUserAllowedGuard = (allowedRoles: string[]) => async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if(!useAuthStore().userAllowed(allowedRoles))
        return { name: 'error404' }
}

export const clearStores = () => {
    useUserStore().clearStore();
    usePersonalProtectiveEquipmentStore().clearStore();
    useIoTDeviceStore().clearStore();
    useSensorStore().clearStore();
}