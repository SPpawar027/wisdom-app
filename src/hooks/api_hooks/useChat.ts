import { createGroup, getGroups } from "@/src/services/chat.service";

export const useChat = () => {
  const handleCreateGroup = async (
    username: string,
    description: string,
    selectedCategory: string,
    isPublic: boolean,
    addedFriends: string[],
  ) => {
    const data = {
      name: username,
      member: addedFriends,
      isPublic: isPublic,
      description: description,
      category: selectedCategory,
    };
    const response: any = await createGroup(data);
    console.log("🚀 ~ handleAuthSubmit ~ response:", response);
    if (response.status === 200) {
      return response;
    }
  };

  const GetGroupsList = async () => {
    const response: any = await getGroups();
    console.log("🚀 ~ handleAuthSubmit ~ response27:", response);
    if (response.status === 200) {
      return response;
    }
  };

  return { handleCreateGroup, GetGroupsList };
};
