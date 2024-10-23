// <========================= file to store date store ===================>

// import the required data
import { create } from "zustand";
import { SelectDate } from "../types/types";

export const DateStore = create<SelectDate>((set, get) => {
  let initialState = {
    date: null,
  };
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("dateState");
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
    changeDate: (date) => {
      set({ date });
      if (typeof window !== "undefined") {
        localStorage.setItem("dateState", JSON.stringify({ ...get(), date }));
      }
    },
  };
});
