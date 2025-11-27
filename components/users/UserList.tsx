import { FlatList, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { UserItem } from './UserItem';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorMessage } from './ErrorMessage';
import { User } from '@/store/slices/usersSlice';

interface UserListProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export function UserList({ users, isLoading, error }: UserListProps) {
  if (isLoading && users.length === 0) {
    return <LoadingIndicator message="Cargando usuarios..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (users.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText>No hay usuarios para mostrar</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserItem user={item} />}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          isLoading ? (
            <ThemedView style={styles.footer}>
              <LoadingIndicator message="Cargando más..." />
            </ThemedView>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  footer: {
    padding: 10,
  },
});

