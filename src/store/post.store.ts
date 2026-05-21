import { create } from "zustand";

export interface PostState {
  postData: any;
  setPostData: (postData: any) => void;
  createPost: (prev: any, postData: any) => void;
  deletePost: (postId: string) => void;
}

export const usePostStore = create<PostState>((set) => ({
  postData: null,
  setPostData: (postData: any) => set({ postData }),

  createPost: (prev: any, postData: any) =>
    set({ ...prev, postData: postData }),

  deletePost: (postId: string) =>
    set((prev) => ({
      ...prev,
      postData: prev.postData.filter((item: any) => item._id !== postId),
    })),
}));
