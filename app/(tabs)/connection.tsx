import { followService } from "@/src/services/follow.service";
import { useAuthStore } from "@/src/store/auth.store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const users = [
  {
    id: 1,
    name: "Marcus Aurelius",
    subtitle: "Stoic reflections on leadership",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaDBbPUddsjN0vMyyUPoVK_94waSj85-4YgmKMUcywFzg9EcM70AaAF65R3TNBnhYNk6n4GYCcDHuEsGze5wDyrEy9e74DtYmD-uw4lOLbTqH7Q4exJ74g1VecjkjHN_dg7VQfEUzMuhqFsj7emDefUDHsfIMjlOhElDDjR005830x_22YXFO3uMNHUxvgnCLuv_gcNH7_o7Rvsxroc_bjhC09skNnBdOpH8wXJhBWR6_BCgv4pgvJ5nNZVT4tf0QlanTpra5mau0",
    following: true,
  },
  {
    id: 2,
    name: "Amara Okafor",
    subtitle: "Followed by Soren K. and 12 others",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCS-2sDCiD-T2o42PM5rmAVaIUvgOGxHCzzylQntT5rRzvze4IwkXaN_PUigFzVykX78bVk471DbBRKOvTBzrd7vTExfPBTnaBwm_CP-l2ESg2NICVqep_0ZD1zNuLgKwA8OWDVbo_epORr5HVB7YziqpRUgG3XgBJXXn6o8DrER6uu1cBa0SDsL8WCxlbz8h5TQXypczV71hLy5F1_GT5tk1K05BCKeHZuOL8s3eTSpAMaMnZA8qiQZqDCMPTZHSR55m_GN8w7s_E",
    following: true,
  },
  {
    id: 3,
    name: "Soren K.",
    subtitle: "Existential insights & daily wisdom",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnYYPXwh2tvw08isuOFM7_lgfQegZHO-LKG8U6mq_kNcG_lOxHYkUlDQPPgRlgPLPqhMk_94A4IFEAmyeGLmbbiZRAsOgUragYnc1tRGuYC2V_4X_Vp7_rY3KYWGyE4QqDYKwGNwLSnUd4ukmJkh1yKjOO9nKAKD_-p-YgK4ba3AWQmmyPOSf9rQ9Ewg__36W4wa6XW3CABxoA98Xwmo4hAMVbateNDMdFLKf6rSh0gmsGe842603QcfIkiJwM-7Noejw99Wk4N7M",
    following: false,
  },
];

const ConnectionsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Following");
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user }: any = useAuthStore();
  console.log("🚀 ~ ConnectionsScreen ~ user:", user)
  const { follow, unfollow, getUserList, getFollowing, getFollowers } =
    followService();
  const handleFollow = (id: string) => {
    follow(id)
      .then((res) => {
        setUserList((prev: any) =>
          prev.map((item: any) =>
            item._id === id ? { ...item, isFollowing: true } : item,
          ),
        );
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleUnFollow = (id: string) => {
    unfollow(id)
      .then((res) => {
        setUserList((prev: any) =>
          prev.map((item: any) =>
            item._id === id ? { ...item, isFollowing: false } : item,
          ),
        );
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    setUserList([]);
    if (activeTab === "Following") {
      getFollowing(user?.id)
        .then((res) => {
          setUserList(res.users);
        })
        .catch((err) => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (activeTab === "Followers") {
      getFollowers(user?.id)
        .then((res: any) => {
          setUserList(res.users);
        })
        .catch((err) => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      getUserList()
        .then((res: any) => {
          console.log("🚀 ~ ConnectionsScreen ~ res:", res)
          setUserList(res?.users);
        })
        .catch((err) => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [activeTab]);
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connections</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["Followers", "Following", "Suggested"].map((tab, index) => (
          <TouchableOpacity
            onPress={() => setActiveTab(tab)}
            key={index}
            style={[styles.tab, tab === activeTab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                tab === activeTab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Your Digital {"\n"}
          <Text style={styles.highlight}>Circle</Text>
        </Text>
        <Text style={styles.subtitle}>
          You are curating a sanctuary of wisdom with 142 thinkers.
        </Text>
      </View>

      {/* Users */}
      <View style={styles.list}>
        {/* {users.map((user) => (
          <View key={user.id} style={styles.card}>
            <View style={styles.userInfo}>
              <Image source={{ uri: user.image }} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.desc}>{user.subtitle}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, !user.following && styles.followBtn]}
            >
              <Text style={styles.buttonText}>
                {user.following ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
        ))} */}

        {loading && <ActivityIndicator size="large" color="#00647c" />}
        <FlatList
          data={userList}
          contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }: any) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.userInfo}>
                <Image source={{ uri: users[0].image }} style={styles.avatar} />
                <View>
                  <Text style={styles.name}>{item.username}</Text>
                  {/* <Text style={styles.desc}>{item.subtitle}</Text> */}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (item.isFollowing || activeTab === "Following") {
                    handleUnFollow(item._id);
                  } else if (activeTab === "Followers") {
                    handleUnFollow(item._id);
                  } else {
                    handleFollow(item._id);
                  }
                }}
                style={[styles.button, !users[0].following && styles.followBtn]}
              >
                <Text style={styles.buttonText}>
                  {activeTab === "Following" || activeTab === "Followers" ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
            // <View key={item.id} style={styles.card}>
            //   <View style={styles.userInfo}>
            //     <Image source={{ uri: item.image }} style={styles.avatar} />
            //     <View>
            //       <Text style={styles.name}>{item.name}</Text>
            //       <Text style={styles.desc}>{item.subtitle}</Text>
            //     </View>
            //   </View>

            //   <TouchableOpacity
            //     style={[styles.button, !item.following && styles.followBtn]}
            //   >
            //     <Text style={styles.buttonText}>
            //       {item.following ? "Following" : "Follow"}
            //     </Text>
            //   </TouchableOpacity>
            // </View>
          )}
        />
      </View>
      {/* </ScrollView> */}

      {/* Bottom Nav */}
      {/* <View style={styles.bottomNav}>
        {["Home", "Wisdom", "Connections", "Profile"].map((item) => (
          <Text
            key={item}
            style={[styles.navItem, item === "Connections" && styles.activeNav]}
          >
            {item}
          </Text>
        ))}
      </View> */}
    </SafeAreaView>
  );
};

export default ConnectionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },
  header: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00647c",
  },
  tabs: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#e6e8eb",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#00647c",
  },
  tabText: {
    fontSize: 14,
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  highlight: {
    color: "#00647c",
    fontStyle: "italic",
  },
  subtitle: {
    marginTop: 8,
    color: "#666",
  },
  list: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
  },
  desc: {
    fontSize: 12,
    color: "#777",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#ddd",
    borderRadius: 20,
  },
  followBtn: {
    backgroundColor: "#00647c",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
  },
  bottomNav: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  navItem: {
    color: "#888",
  },
  activeNav: {
    color: "#00647c",
    fontWeight: "700",
  },
});
