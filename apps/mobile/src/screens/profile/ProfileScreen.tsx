import React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import { Screen } from "../../components/Screen";
import { useAuth } from "../../hooks/useAuth";
import { colors, radii, spacing } from "../../theme";

export function ProfileScreen({ embedded = false }: { embedded?: boolean }) {
  const { user, signOut } = useAuth();

  const body = (
    <View style={styles.card}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.meta}>{user?.email ?? user?.mobile}</Text>
      <Text style={styles.role}>{user?.role?.replace(/_/g, " ")}</Text>
      {!embedded ? (
        <Pressable style={styles.logout} onPress={() => signOut()}>
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
      ) : null}
    </View>
  );

  if (embedded) return body;
  return (
    <Screen title="Profile" subtitle="Role comes from the server, not a client picker">
      {body}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },
  name: { fontSize: 18, fontWeight: "700", color: colors.navy },
  meta: { color: colors.textSecondary, marginTop: 4 },
  role: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: colors.tealLight,
    color: colors.tealDark,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
    fontWeight: "700",
    fontSize: 12,
  },
  logout: {
    marginTop: spacing.lg,
    backgroundColor: colors.navy,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: { color: colors.white, fontWeight: "700" },
});
