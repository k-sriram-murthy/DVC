import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";
import { colors, radii, spacing } from "../../theme";
import type { RootTabParamList } from "../../navigation/RootTabs";

export function SupervisorHomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <Screen title="Site supervisor" subtitle="Fast actions for the field">
      <View style={styles.grid}>
        <Action
          label="Add Expense"
          onPress={() => navigation.navigate("AddExpense")}
          primary
        />
        <Action label="Update Progress" onPress={() => navigation.navigate("Activities")} />
        <Action label="Receive Materials" onPress={() => navigation.navigate("More")} />
        <Action label="Site Photos" onPress={() => navigation.navigate("SitePhotos")} />
      </View>
      <PlaceholderCard
        title="Today's activities"
        body="Assigned activities and recent submission statuses will appear here once progress APIs are wired."
      />
    </Screen>
  );
}

function Action({
  label,
  onPress,
  primary,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.action, primary && styles.actionPrimary]}
    >
      <Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  action: {
    width: "48%",
    minHeight: 88,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  actionPrimary: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  actionText: {
    color: colors.navy,
    fontWeight: "700",
    textAlign: "center",
  },
  actionTextPrimary: { color: colors.white },
});
