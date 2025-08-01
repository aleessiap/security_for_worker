import { useAuthStore } from "@/stores/auth";

import axios from "axios";

let api = axios.create({
    baseURL: import.meta.env.VITE_BE_URL ?? ``,
});

api.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    (request: any) => {
        if (useAuthStore().isLogged())
            request.headers.Authorization = `Bearer ${useAuthStore().jwt}`;

        return request;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export default api;