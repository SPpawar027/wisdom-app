import { create } from "zustand";

export const useChatStore = create((set) => ({
  groups: [],
  addGroup: (group: any) =>
    set((state: any) => ({
      groups: [...state.groups, group],
    })),
  removeGroup: (group: any) =>
    set((state: any) => ({
      groups: state.groups.filter((g: any) => g._id !== group._id),
    })),
  setGroups: (groups: any) =>
    set((state: any) => ({
      groups,
    })),
  clearGroups: () =>
    set((state: any) => ({
      groups: [],
    })),
}));
