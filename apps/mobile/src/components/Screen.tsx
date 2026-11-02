import React from "react";
import { ScrollView, StyleSheet, View, Text, ViewStyle } from "react-native";
import { colors, spacing } from "../theme";

export function Screen({
  children,
  title,
  subtitle,
  scroll = true,
  style,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  style?: ViewStyle;
}) {
  const body = (
    <View style={[styles.inner, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );

  if (!scroll) {
    return <View style={styles.root}>{body}</View>;
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {body}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.offWhite },
  content: { paddingBottom: spacing.xxl },
  inner: { padding: spacing.md },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
});
