import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <ThemedView style={styles.container} lightColor="#ffebee" darkColor="#3d1f1f">
      <ThemedText style={styles.text} lightColor="#c62828" darkColor="#ef5350">
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
  },
});

