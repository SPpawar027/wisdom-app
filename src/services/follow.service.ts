import { api } from "./api";

export const followService = () => {
  const follow = async (userId: string) => {
    try {
      const response = await api.put(`/api/v1/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const unfollow = async (userId: string) => {
    try {
      const response = await api.put(`/api/v1/users/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getFollowers = async (userId: string) => {
    try {
      const response = await api.get(`/api/v1/users/${userId}/followers`);
      console.log("🚀 ~ getFollowers ~ response:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getFollowing = async (userId: string) => {
    console.log("🚀 ~ getFollowing ~ userId:", userId)
    try {
      const response = await api.get(`/api/v1/users/${userId}/following`);
      console.log("🚀 ~ getFollowing ~ response:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getUserList = async () => {
    try {
      const response = await api.get(`/api/v1/users/user-list`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    follow,
    unfollow,
    getFollowers,
    getFollowing,
    getUserList,
  };
};
