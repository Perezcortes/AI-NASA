import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NoticiaSimple = {
  title: string;
  description: string;
  imageUrl: string;
  nasaLink: string;
};

interface ReadLaterState {
  items: NoticiaSimple[];
}

// Función para cargar el estado desde localStorage
const loadFromLocalStorage = (): ReadLaterState => {
  if (typeof window === 'undefined') return { items: [] };
  try {
    const data = localStorage.getItem('readLater');
    if (data) return JSON.parse(data);
    return { items: [] };
  } catch {
    return { items: [] };
  }
};

// Función para guardar el estado en localStorage
const saveToLocalStorage = (state: ReadLaterState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('readLater', JSON.stringify(state));
  } catch {
    // Fail silently
  }
};

const initialState: ReadLaterState = loadFromLocalStorage();

const readLaterSlice = createSlice({
  name: 'readLater',
  initialState,
  reducers: {
    addToReadLater(state, action: PayloadAction<NoticiaSimple>) {
      if (!state.items.find(n => n.nasaLink === action.payload.nasaLink)) {
        state.items.push(action.payload);
        saveToLocalStorage(state);
      }
    },
    removeFromReadLater(state, action: PayloadAction<string>) {
      state.items = state.items.filter(n => n.nasaLink !== action.payload);
      saveToLocalStorage(state);
    },
    clearReadLater(state) {
      state.items = [];
      saveToLocalStorage(state);
    }
  }
});

export const { addToReadLater, removeFromReadLater, clearReadLater } = readLaterSlice.actions;
export default readLaterSlice.reducer;
