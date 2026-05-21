import { api } from "./api";

export const getPostById = async (postId: string) => {
  const res = await api.get(`/api/v1/post/${postId}`);
  return res.data;
};

export const deletePostById = async (postId: string) => {
  const res = await api.delete(`/api/v1/posts/post/${postId}`);
  console.log("🚀 ~ post.service.ts:10 ~ deletePostById ~ res:", res);
  return res.data;
};

export const getPostsByUserId = async (userId: string) => {
  console.log("🚀 ~ post.service.ts:10 ~ getPostsByUserId ~ user Id:", userId);
  const res: any = await api.get(`/api/v1/posts/${userId}`);
  // console.log("🚀 ~ post.service.ts:11 ~ getPostsByUserId ~ res:", res);
  return res?.data.response;
};
