import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Pagination } from "@/components/users/Pagination";
import { UserList } from "@/components/users/UserList";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, loadLocalUsers, Status } from "@/store/slices/usersSlice";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Switch, TextInput } from "react-native";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { items, localUsers, fetchStatus, error, currentPage, totalPages } =
    useAppSelector((state) => state.users);

  const [searchQuery, setSearchQuery] = useState("");
  const [showLocalUsers, setShowLocalUsers] = useState(true);

  useEffect(() => {
    dispatch(loadLocalUsers());
    dispatch(fetchUsers(1));
  }, [dispatch]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(fetchUsers(currentPage + 1));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(fetchUsers(currentPage - 1));
    }
  };

  const displayUsers = useMemo(() => {
    const filterUsers = (users: typeof items) => {
      if (!searchQuery.trim()) return users;

      const query = searchQuery.toLowerCase().trim();
      return users.filter((user) => {
        const name = (
          user.name ||
          `${user.first_name} ${user.last_name}`.trim() ||
          ""
        ).toLowerCase();
        const email = (user.email || "").toLowerCase();
        const job = (user.job || "").toLowerCase();

        return (
          name.includes(query) || email.includes(query) || job.includes(query)
        );
      });
    };

    const filteredApiUsers = filterUsers(items);

    if (currentPage === 1 && showLocalUsers) {
      const filteredLocalUsers = filterUsers(localUsers);
      return [...filteredLocalUsers, ...filteredApiUsers];
    }

    return filteredApiUsers;
  }, [items, localUsers, currentPage, showLocalUsers, searchQuery]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Usuarios</ThemedText>
      </ThemedView>

      <ThemedView style={styles.controls}>
        <ThemedView style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuarios..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </ThemedView>

        <ThemedView style={styles.filterContainer}>
          <ThemedText style={styles.filterLabel}>
            Mostrar usuarios creados
          </ThemedText>
          <Switch
            value={showLocalUsers}
            onValueChange={setShowLocalUsers}
            trackColor={{ false: "#e0e0e0", true: "#0a7ea4" }}
            thumbColor={showLocalUsers ? "#fff" : "#f4f3f4"}
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.listContainer}>
        <UserList
          users={displayUsers}
          isLoading={fetchStatus === Status.Loading}
          error={fetchStatus === Status.Failed ? error : null}
        />
      </ThemedView>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        isLoading={fetchStatus === Status.Loading}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  controls: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  searchContainer: {
    marginBottom: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 44,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterLabel: {
    fontSize: 14,
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
});
