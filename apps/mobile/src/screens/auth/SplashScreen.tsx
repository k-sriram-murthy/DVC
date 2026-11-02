import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing } from "../../theme";

export function SplashScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.brand}>Devi Vasantha Constructions</Text>
      <Text style={styles.tagline}>Build · Manage · Track</Text>
      <ActivityIndicator color={colors.teal} style={{ marginTop: spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  brand: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  tagline: {
    marginTop: spacing.sm,
    color: colors.tealLight,
    fontSize: 14,
    letterSpacing: 1,
  },
});
