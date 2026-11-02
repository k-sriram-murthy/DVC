import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { UserRole } from "@dvc/shared";
import { Screen } from "../../components/Screen";
import { useAuth } from "../../hooks/useAuth";
import { colors, radii, spacing } from "../../theme";
export function MoreScreen() {
  const { user, signOut } = useAuth();

  const directorItems = [
    "Approvals",
    "Budgets",
    "Reports",
    "Customers",
    "Notifications",
    "User Management",
    "Settings",
  ];
  const supervisorItems = ["My Submissions", "Materials Received", "Notifications", "Profile"];
  const pmItems = ["Approvals", "Budgets", "Reports", "Notifications", "Settings"];

  const items =
    user?.role === UserRole.DIRECTOR
      ? directorItems
      : user?.role === UserRole.SITE_SUPERVISOR
        ? supervisorItems
        : pmItems;

  const roleLabel = (user?.role ?? "").replace(/_/g, " ");

  return (
    <Screen title="More" subtitle={roleLabel}>
      <View style={styles.row}>
        <Text style={styles.rowText}>{user?.name}</Text>
        <Text style={styles.badge}>{roleLabel}</Text>
      </View>
      {items.map((item) => (
        <View key={item} style={styles.row}>
          <Text style={styles.rowText}>{item}</Text>
          <Text style={styles.badge}>Soon</Text>
        </View>
      ))}
      <Pressable style={styles.logout} onPress={() => signOut()}>
        <Text style={styles.logoutText}>Sign out</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowText: { color: colors.navy, fontWeight: "600" },
  badge: { color: colors.amber, fontSize: 12, fontWeight: "700" },
  logout: {
    marginTop: spacing.md,
    backgroundColor: colors.navy,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: { color: colors.white, fontWeight: "700" },
});
