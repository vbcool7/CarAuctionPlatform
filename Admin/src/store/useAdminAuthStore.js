
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminAuthStore = create(
    persist(
        (set) => ({
            admin: null,
            token: null,

            login: (admin, token) => {
                if (!admin || !token) {
                    console.error('useAdminAuthStore.login called with missing admin or token', { admin, token });
                    return;
                }
                set({ admin, token });
            },

            logout: () => {
                set({ admin: null, token: null });
                window.location.href = '/admin-login';
            }
        }),
        {
            name: 'admin-auth-storage',
        }
    )
);

export default useAdminAuthStore;