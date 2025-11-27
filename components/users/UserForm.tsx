import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ErrorMessage } from "./ErrorMessage";
import { SuccessMessage } from "./SuccessMessage";

interface UserFormProps {
  onSubmit: (data: {
    name: string;
    job: string;
    email?: string;
    imageUrl?: string;
  }) => void;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  onClearError: () => void;
  onClearSuccess: () => void;
}

export function UserForm({
  onSubmit,
  isLoading,
  error,
  success,
  onClearError,
  onClearSuccess,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (success) {
      setName("");
      setJob("");
      setEmail("");
      setImageUrl("");
    }
  }, [success]);

  const validateEmail = (email: string) => {
    if (!email.trim()) return true; // Email es opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!name.trim() || !job.trim()) {
      Alert.alert("Error", "Por favor completa los campos requeridos");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return;
    }

    onSubmit({
      name: name.trim(),
      job: job.trim(),
      email: email.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Crear Usuario
      </ThemedText>

      <ThemedView style={styles.form}>
        <ThemedText style={styles.label}>Nombre</ThemedText>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ingresa el nombre"
          placeholderTextColor="#999"
          editable={!isLoading}
        />

        <ThemedText style={styles.label}>Job (Rol/Puesto)</ThemedText>
        <TextInput
          style={styles.input}
          value={job}
          onChangeText={setJob}
          placeholder="Ingresa el puesto"
          placeholderTextColor="#999"
          editable={!isLoading}
        />

        <ThemedText style={styles.label}>Email (Opcional)</ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="usuario@ejemplo.com"
          placeholderTextColor="#999"
          editable={!isLoading}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <ThemedText style={styles.label}>URL de Imagen (Opcional)</ThemedText>
        <TextInput
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://ejemplo.com/imagen.jpg"
          placeholderTextColor="#999"
          editable={!isLoading}
          autoCapitalize="none"
          keyboardType="url"
        />

        {error && <ErrorMessage message={error} />}
        {success && (
          <SuccessMessage
            message="Usuario creado exitosamente"
            onHide={onClearSuccess}
          />
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ThemedView style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#fff" />
              <ThemedText style={styles.buttonText}>Creando...</ThemedText>
            </ThemedView>
          ) : (
            <ThemedText style={styles.buttonText}>Crear Usuario</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 44,
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
