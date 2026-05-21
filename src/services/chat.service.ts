import { Socket } from "socket.io-client";
import { api, socket } from "./api";


// Use the shared socket from api.ts instead of creating a new one
export const getSocket = (): Socket => socket;


export const getChatId = async (userId: string | number) => {
  const res = await api.post(`/api/v1/chat/create/${userId}`);
  console.log("🚀 ~ getChatId user ~ res:", res);
  return res.data.newChat._id;
};

export const getChatMessages = async (chatId: string) => {
  const res = await api.get(`/api/v1/chat/messages/${chatId}`);
  console.log("🚀 ~ getChatMessages ~ res:", res);
  return res.data.messages;
};

export const joinChat = (userId: string) => {
  if (userId) {
    console.log("🚀 ~ joinChat ~ userId:", userId)
    socket.emit("join_chat", userId);
  }
};

// Group create apis

export const createGroup = async (data: any) => {
  const res = await api.post(`/api/v1/chat/group`, data);
  console.log("🚀 ~ createGroup ~ res:", res);
  return res.data;
};

export const getGroups = async () => {
  const res = await api.get(`/api/v1/chat/groups`);
  console.log("🚀 ~ getGroups ~ res:", res);
  return res.data;
};

export const getGroupMessages = async (groupId: string) => {
  const res = await api.get(`/api/v1/chat/group/${groupId}`);
  console.log("🚀 ~ getGroupMessages ~ res:", res);
  return res.data.messages;
};

export const getGroupDetailByID = async (groupId: string) => {
  const res = await api.get(`/api/v1/chat/group/${groupId}/details`);
  console.log("🚀 ~ getGroupDetail ~ res:", res);
  return res.data.result;
}
