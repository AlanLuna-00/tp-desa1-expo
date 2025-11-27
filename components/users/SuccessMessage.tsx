import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface SuccessMessageProps {
  message: string;
  onHide: () => void;
  duration?: number;
}

export function SuccessMessage({ message, onHide, duration = 3000 }: SuccessMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onHide();
    }, duration);

    return () => clearTimeout(timer);
  }, [onHide, duration]);

  return (
    <ThemedView style={styles.container} lightColor="#e8f5e9" darkColor="#1b3d1f">
      <ThemedText style={styles.text} lightColor="#2e7d32" darkColor="#81c784">
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

