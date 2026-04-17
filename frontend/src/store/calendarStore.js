import { create } from 'zustand';

export const useCalendarStore = create((set) => ({
  today: null,
  tomorrow: null,
  selectedDate: null,
  monthData: [],
  festivals: [],
  isLoading: false,
  error: null,

  setToday: (data) => set({ today: data }),

  setTomorrow: (data) => set({ tomorrow: data }),

  setSelectedDate: (data) => set({ selectedDate: data }),

  setMonthData: (data) => set({ monthData: data }),

  setFestivals: (data) => set({ festivals: data }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      today: null,
      tomorrow: null,
      selectedDate: null,
      monthData: [],
      festivals: [],
      isLoading: false,
      error: null,
    }),
}));
