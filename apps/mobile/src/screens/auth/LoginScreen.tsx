import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { colors, radii, spacing } from "../../theme";
import { useAuth } from "../../hooks/useAuth";

/**
 * Secure login — role is determined by the backend after authentication.
 * The mockup "Login As" role picker is visual reference only and is NOT implemented.
 */
export function LoginScreen() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("director@dvc.local");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(identifier.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.brand}>Devi Vasantha Constructions</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Mobile or email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={identifier}
          onChangeText={setIdentifier}
          placeholder="director@dvc.local"
          placeholderTextColor={colors.grey400}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={colors.grey400}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.navy,
    justifyContent: "center",
    padding: spacing.lg,
  },
  brand: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: colors.tealLight,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  label: {
    color: colors.grey700,
    fontSize: 13,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.offWhite,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.teal,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    color: colors.red,
    marginTop: spacing.sm,
    fontSize: 13,
  },
});
