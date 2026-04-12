import { useAuthStore } from "~/stores/auth";
import { getActivePinia } from "pinia";

export default defineNuxtRouteMiddleware((to) => {
    const pinia = getActivePinia();

    if (pinia) {
        const authStore = useAuthStore(pinia);

        /*if (!authStore.user.isAuthenticated && to.path !== '/login') {
            console.log('redirected to authentication page');
            return navigateTo('/login');
        }*/
    }
})