import { ToastServiceMethods } from "primevue/toastservice";

export function HttpErrorToast(summary: string, detail: string, toastInstance: ToastServiceMethods) {     
    toastInstance.add({ severity: 'error', summary: summary, detail: detail, life: 5000 });
}