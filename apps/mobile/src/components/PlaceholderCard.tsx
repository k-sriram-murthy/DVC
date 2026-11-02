import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radii, spacing, shadows } from "../theme";

export function PlaceholderCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  title: { fontWeight: "700", color: colors.navy, marginBottom: spacing.xs },
  body: { color: colors.textSecondary, lineHeight: 20 },
});
