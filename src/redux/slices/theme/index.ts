import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
  mode: "light" | "dark";
}

const initialState: ThemeState = {
  mode: "dark",
};

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const { toggleMode } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
