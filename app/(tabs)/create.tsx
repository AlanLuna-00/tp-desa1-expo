import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { UserForm } from "@/components/users/UserForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCreateStatus,
  clearError,
  createUser,
  Status,
} from "@/store/slices/usersSlice";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function CreateScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { createStatus, error } = useAppSelector((state) => state.users);

  const handleCreateUser = (userData: {
    name: string;
    job: string;
    email?: string;
    imageUrl?: string;
  }) => {
    dispatch(createUser(userData));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleClearSuccess = () => {
    dispatch(clearCreateStatus());
  };

  useEffect(() => {
    if (createStatus === Status.Succeeded) {
      const timer = setTimeout(() => {
        router.push("/(tabs)");
        dispatch(clearCreateStatus());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [createStatus, router, dispatch]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.header}>
          <ThemedText type="title">Crear Usuario</ThemedText>
          <ThemedText style={styles.subtitle}>
            Completa el formulario para agregar un nuevo usuario
          </ThemedText>
        </ThemedView>

        <UserForm
          onSubmit={handleCreateUser}
          isLoading={createStatus === Status.Loading}
          error={createStatus === Status.Failed ? error : null}
          success={createStatus === Status.Succeeded}
          onClearError={handleClearError}
          onClearSuccess={handleClearSuccess}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
    gap: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});
