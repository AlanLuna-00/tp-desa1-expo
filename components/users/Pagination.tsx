import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  isLoading = false,
}: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            (isFirstPage || isLoading) && styles.pageButtonDisabled,
          ]}
          onPress={onPrevPage}
          disabled={isFirstPage || isLoading}
        >
          <IconSymbol
            name="chevron.left"
            size={20}
            color={isFirstPage || isLoading ? "#999" : "#0a7ea4"}
          />
        </TouchableOpacity>

        <ThemedView style={styles.pageInfo}>
          <ThemedText style={styles.pageText}>
            {currentPage} / {totalPages}
          </ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.pageButton,
            (isLastPage || isLoading) && styles.pageButtonDisabled,
          ]}
          onPress={onNextPage}
          disabled={isLastPage || isLoading}
        >
          <IconSymbol
            name="chevron.right"
            size={20}
            color={isLastPage || isLoading ? "#999" : "#0a7ea4"}
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  pageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  pageButtonDisabled: {
    borderColor: "#e0e0e0",
    opacity: 0.5,
  },
  pageInfo: {
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  pageText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
