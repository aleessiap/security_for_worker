import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

import { clearStores, isLoggedGuard, isUserAllowedGuard } from './guards';
import { UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: 'personal-area',
                    name: 'personalArea',
                    component: () => import('@/views/pages/PersonalArea.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN,
                            UserRoleEnum.SAFETY_MANAGER
                        ])
                    ]
                },
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('@/views/pages/List/Users.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN
                        ])
                    ]
                },
                {
                    path: 'operators',
                    name: 'operators',
                    component: () => import('@/views/pages/List/Operators.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN,
                            UserRoleEnum.SAFETY_MANAGER
                        ])
                    ]
                },
                {
                    path: 'personal-protective-equipments',
                    name: 'personalProtectiveEquipments',
                    component: () => import('@/views/pages/List/PersonalProtectiveEquipments.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN,
                            UserRoleEnum.SAFETY_MANAGER
                        ])
                    ]
                },
                {
                    path: 'iot-devices',
                    name: 'iotDevices',
                    component: () => import('@/views/pages/List/IoTDevices.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN,
                            UserRoleEnum.SAFETY_MANAGER
                        ])
                    ]
                },
                {
                    path: 'sensors',
                    name: 'sensors',
                    component: () => import('@/views/pages/List/Sensors.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN,
                            UserRoleEnum.SAFETY_MANAGER
                        ])
                    ]
                },
                {
                    path: 'jobs',
                    name: 'jobs',
                    component: () => import('@/views/pages/List/Jobs.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN,
                            UserRoleEnum.SAFETY_MANAGER
                        ])
                    ]
                },
                {
                    path: 'environments',
                    name: 'environments',
                    component: () => import('@/views/pages/List/Environments.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN,
                            UserRoleEnum.SAFETY_MANAGER
                        ])
                    ]
                },
                {
                    path: 'operator-events',
                    name: 'operatorEvents',
                    component: () => import('@/views/pages/List/OperatorEvents.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN,
                            UserRoleEnum.SAFETY_MANAGER
                        ])
                    ]
                },
                {
                    path: 'environment-events',
                    name: 'environmentEvents',
                    component: () => import('@/views/pages/List/EnvironmentEvents.vue'),
                    beforeEnter: [
                        isUserAllowedGuard([
                            UserRoleEnum.SUPER_ADMIN,
                            UserRoleEnum.COMPANY_ADMIN,
                            UserRoleEnum.SAFETY_MANAGER
                        ])
                    ]
                }
            ],
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'error404',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('@/views/pages/auth/Logout.vue')
        }
    ]
});

router.beforeEach(isLoggedGuard);
router.beforeEach(clearStores);

export default router;
