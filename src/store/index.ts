import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import server from '../server';
import { Toast } from '../utils/Toast';

interface AuthState {
  user: any;
  business: any;
  spreadsheet: any;
  settings: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  register: (first_name: string, last_name: string, email: string, password: string) => Promise<{ success: boolean }>;
  registerBusiness: (name: string, email: string, street: string, state: string, country: string) => Promise<{ success: boolean }>;
  logout: () => void;
  setUser: (user: any) => void;
  setToken: (token: any) => void;
  setSpreadsheet: (spreadsheet: any) => void;
  setSettings: (settings: any) => void;
  setBusiness: (business: any) => void;
}

type Auth = AuthState & AuthActions;

export const useAuthStore = create<Auth>()(
  persist(
    (set) => ({
      user: null,
      business: null,
      spreadsheet: null,
      settings: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        const { data, message, status } = await server.LoginAdmin(email, password);
        if (status !== 'OK') {
          set({ isLoading: false });
          Toast(message, true);
          return { success: false, message: message || 'Login failed' };
        }
        Toast(message);
        set({
          user: data.admin,
          business: data.business,
          spreadsheet: data.business?.spreadsheet,
          settings: data.business?.settings,
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
          Toast(message, true);
          set({ isLoading: false });
          return { success: false };
        }
        Toast(message);
        return { success: true };
      },

      registerBusiness: async (name: string, email: string, street: string, state: string, country: string) => {
        const { message, status, data } = await server.createBusiness({ name, email, street, state, country } as any);
        if (status !== 'CREATED') {
          Toast(message, true);
          return { success: false };
        }
        Toast(message);
        // const business = { id: data.id, name: data.name, email: data.email, address: { street: data.add, state, country } }; // Mock business object
        set({ business: data });
        return { success: true };
      },
      
      logout: () => {
        set({
          user: null,
          business: null,
          spreadsheet: null,
          settings: null,
          token: null,
          isAuthenticated: false
        });
      },
      
      setUser: (user: any) => set({ user }),
      setToken: (token: any) => set({ token, isAuthenticated: !!token }),
      setSpreadsheet: (spreadsheet: any) => set({ spreadsheet }),
      setSettings: (settings: any) => set({ settings }),
      setBusiness: (business: any) => set({ business }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        business: state.business,
        spreadsheet: state.spreadsheet,
        settings: state.settings,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
