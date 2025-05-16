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
  similarImages: Array<{
    url: string;
    title: string;
    sourceUrl: string;
  }>;
  editedImage: string | null;
  prompt: string;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setMainImage: (image: string | null) => void;
  setGeneratedImage: (url: string | null) => void;
  setSimilarImages: (images: Array<{ url: string; title: string; sourceUrl: string; }>) => void;
  setEditedImage: (image: string | null) => void;
  setPrompt: (text: string) => void;
  resetImages: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  mainImage: null,
  generatedImage: null,
  similarImages: [],
  editedImage: null,
  prompt: '',
  setUser: (user) => set({ user }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLoading: (value) => set({ isLoading: value }),
  setMainImage: (image) => set({ mainImage: image }),
  setGeneratedImage: (url) => set({ generatedImage: url }),
  setSimilarImages: (images) => set({ similarImages: images }),
  setEditedImage: (image) => set({ editedImage: image }),
  setPrompt: (text) => set({ prompt: text }),
  resetImages: () => set({ mainImage: null, generatedImage: null, similarImages: [], editedImage: null, prompt: '' }),
})); 