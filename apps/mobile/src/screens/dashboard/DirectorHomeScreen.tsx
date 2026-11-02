import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { formatINRCompact } from "@dvc/shared";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";
import { colors, radii, spacing } from "../../theme";
import { useAuth } from "../../hooks/useAuth";

export function DirectorHomeScreen() {
  const { user } = useAuth();

  return (
    <Screen title="Director dashboard" subtitle={`Welcome, ${user?.name ?? "Director"}`}>
      <View style={styles.row}>
        <Kpi label="Active projects" value="—" />
        <Kpi label="Total budget" value={formatINRCompact(0)} />
      </View>
      <View style={styles.row}>
        <Kpi label="Recorded spend" value={formatINRCompact(0)} />
        <Kpi label="Pending approvals" value="—" />
      </View>
      <PlaceholderCard
        title="Live totals coming in Phase 4"
        body="KPI cards will calculate from stored expenses, budgets, and approvals. Scaffold shows layout + Indian currency formatting only."
      />
      <PlaceholderCard
        title="Quick actions"
        body="Add Expense (centre tab), Approvals, and Reports will wire here after the expense workflow lands."
      />
    </Screen>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm },
  kpi: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiLabel: { color: colors.textSecondary, fontSize: 12 },
  kpiValue: {
    marginTop: 4,
    color: colors.navy,
    fontSize: 18,
    fontWeight: "700",
  },
});
