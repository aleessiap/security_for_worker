import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { ILoggedUser, ILoginUser, IUser } from '@visioscientiae/backoffice-packages-domo';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import auth from '@/apis/auth';
import { GenericResponse } from '@/apis/utility/generic-response';

export const useAuthStore = defineStore('auth', {
	// ----------------------------------------------------------------
    //								state
    // ----------------------------------------------------------------
    state: () => {
        return {
            _jwt: useStorage('jwt', ''),
            _user: useStorage('user', {} as IUser),
        }
    },
    // ----------------------------------------------------------------
    //								getters
    // ----------------------------------------------------------------
    getters: {
        jwt: (state) => state._jwt,
        user: (state) => state._user,
	},
    // ----------------------------------------------------------------
    //								actions
    // ----------------------------------------------------------------
    actions: {
        isLogged(): boolean {
            if(!this.jwt)
                return false
            
            const decodedJwt = jwtDecode<JwtPayload>(this.jwt)
            if(decodedJwt.exp && decodedJwt.exp < Date.now() / 1000) {
                this.clearStore()
                return false
            }
            
            return true
        },

        clearStore() {
            this._jwt = ''
            this._user = {} as IUser
        },

        logout() {
            this.clearStore()
        },

        async login(credentials: ILoginUser) {
            const response = await auth.login(credentials) as GenericResponse<ILoggedUser>;
            if(response.err)
                throw response.err

            const loggedUser = response.data as ILoggedUser;

            this._jwt = loggedUser.token;
            this._user = loggedUser.user;
        },

        userAllowed(allowedRoles: string[]) {
            return allowedRoles.includes(this.user.role);
        }
    },
})