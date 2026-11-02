import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { formatINR, formatDateDDMMMYYYY } from "@dvc/shared";
import { Screen } from "../../components/Screen";
import { apiRequest } from "../../api/client";
import { colors, radii, spacing } from "../../theme";

type Project = {
  id: string;
  name: string;
  location: string | null;
  status: string;
  approvedBudget: string;
  startDate: string | null;
};

export function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<Project[]>("/projects");
        setProjects(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Screen title="Projects" subtitle="Scoped to your role and assignments">
      {loading ? <ActivityIndicator color={colors.teal} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && projects.length === 0 ? (
        <Text style={styles.empty}>No projects yet. Directors can create projects via the API.</Text>
      ) : null}
      {projects.map((p) => (
        <View key={p.id} style={styles.card}>
          <Text style={styles.name}>{p.name}</Text>
          <Text style={styles.meta}>{p.location ?? "Location TBD"} · {p.status}</Text>
          <Text style={styles.meta}>
            Budget {formatINR(Number(p.approvedBudget))}
            {p.startDate ? ` · Start ${formatDateDDMMMYYYY(p.startDate)}` : ""}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { fontWeight: "700", color: colors.navy, fontSize: 16 },
  meta: { color: colors.textSecondary, marginTop: 4 },
  error: { color: colors.red, marginBottom: spacing.sm },
  empty: { color: colors.textSecondary },
});
