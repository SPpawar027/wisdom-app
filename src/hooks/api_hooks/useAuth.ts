import { getCurrentUserApi, loginApi, registerApi } from "@/src/services/auth.service";
import { useAuthStore } from "@/src/store/auth.store";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export const useAuth = () => {
  const { login } = useAuthStore();
  const handleAuthSubmit = async (
    tab: string,
    email: string,
    password: string,
    username: string,
  ) => {
    try {
      if (tab === "login") {
        const response: any = await loginApi(email, password);
        if (response.status === 200) {
          login({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            email: email,
            username: username,
          });
          const res = await getCurrentUserApi();
          console.log("🚀 ~ handleAuthSubmit ~ res:", res);
          router.push("/(tabs)");
        }
      } else {
        const response: any = await registerApi(username, email, password);
        console.log("🚀 ~ handleAuthSubmit ~ response:", response);
        if (response.status === 200) {
          login(response.user);
          router.push("/(tabs)");
        }
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Something went wrong',
      });
      console.log("🚀 ~ handleAuthSubmit ~ error:", error);
    }

  };

  return handleAuthSubmit;
};
