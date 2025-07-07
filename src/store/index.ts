import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import server from '../server';

interface AuthState {
  user: any;
  business: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  register: (first_name: string, last_name: string, email: string, password: string) => Promise<{ success: boolean } | false>;
  logout: () => void;
  setUser: (user: any) => void;
  setToken: (token: any) => void;
}

type Auth = AuthState & AuthActions;

export const useAuthStore = create<Auth>()(
  persist(
    (set, get) => ({
      user: null,
      business: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        const { data, message, status } = await server.LoginAdmin(email, password);
        if (status !== 'OK') {
          alert(message);
          set({ isLoading: false });
          return { success: false };
        }
        alert(message);
        set({
          user: data.admin,
          business: data.business,
          token: data.token,
          isAuthenticated: true,
          isLoading: false
        });
        console.log(data.token)
        console.log(useAuthStore.getState())
        return { success: true };
      },

      register: async (first_name: string, last_name: string, email: string, password: string) => {
        const { message, status } = await server.RegisterAdmin(first_name, last_name, email, password);
        if (status !== 'CREATED') { 
          alert(message);
          set({ isLoading: false });
          return { success: false };
        }
        return { success: true };
      },
      
      logout: () => {
        set({
          user: null,
          business: null,
          token: null,
          isAuthenticated: false
        });
      },
      
      setUser: (user: any) => set({ user }),
      setToken: (token: any) => set({ token, isAuthenticated: !!token }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        business: state.business,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
