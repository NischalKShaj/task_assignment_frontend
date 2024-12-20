// <===================== store for storing the global state of the application ================>

import { create } from "zustand";
import { UserState } from "../types/types";

// creating the store
export const AppState = create<UserState>((set, get) => {
  let initialState = {
    isAuthorized: false,
    user: null,
  };

  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("appState");
    if (savedState) {
      try {
        initialState = JSON.parse(savedState);
      } catch (error) {
        console.error("error parsing the state", error);
      }
    }
  }

  return {
    ...initialState,
    isLoggedIn: (user) => {
      set({ isAuthorized: true, user });
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "appState",
          JSON.stringify({ ...get(), isAuthorized: true, user })
        );
      }
    },
    isLoggedOut: () => {
      set({ isAuthorized: false, user: null });
      if (typeof window !== "undefined") {
        localStorage.removeItem("appState");
      }
    },
  };
});
