import { IError, ILoggedUser, ILoginUser } from '@visioscientiae/backoffice-packages-domo';
import { GenericResponse } from './utility/generic-response';

import axios from './utility/axios-middleware';

const loginEndpoint = 'auth/login';

export default {
    login: async(credentials: ILoginUser): Promise<GenericResponse<ILoggedUser>> => {
        let result = new GenericResponse<ILoggedUser>();
        try {
            const response = await axios.post (loginEndpoint, credentials);
            result.data = response.data as ILoggedUser;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    }
}