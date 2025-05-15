import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  credits: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mainImage: string | null;
  generatedImage: string | null;
  similarImage: string | null;
  prompt: string;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setMainImage: (url: string | null) => void;
  setGeneratedImage: (url: string | null) => void;
  setSimilarImage: (url: string | null) => void;
  setPrompt: (text: string) => void;
  resetImages: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  mainImage: null,
  generatedImage: null,
  similarImage: null,
  prompt: '',
  setUser: (user) => set({ user }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLoading: (value) => set({ isLoading: value }),
  setMainImage: (url) => set({ mainImage: url }),
  setGeneratedImage: (url) => set({ generatedImage: url }),
  setSimilarImage: (url) => set({ similarImage: url }),
  setPrompt: (text) => set({ prompt: text }),
  resetImages: () => set({ mainImage: null, generatedImage: null, similarImage: null, prompt: '' }),
})); 