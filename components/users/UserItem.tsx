import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { User } from "@/store/slices/usersSlice";

interface UserItemProps {
  user: User;
}

export function UserItem({ user }: UserItemProps) {
  const displayName =
    user.name || `${user.first_name} ${user.last_name}`.trim() || "Sin nombre";
  const displayEmail = user.email || "Sin email";
  const imageUrl = user.avatar || user.imageUrl;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        )}
        <ThemedView style={styles.textContent}>
          <ThemedText type="defaultSemiBold" style={styles.name}>
            {displayName}
          </ThemedText>
          {user.email && (
            <ThemedText style={styles.email}>{displayEmail}</ThemedText>
          )}
          {user.job && <ThemedText style={styles.job}>{user.job}</ThemedText>}
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  content: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
  },
  job: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
  },
});

