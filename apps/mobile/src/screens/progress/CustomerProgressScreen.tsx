import React from "react";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";

export function CustomerProgressScreen() {
  return (
    <Screen title="Progress" subtitle="Milestones on your project">
      <PlaceholderCard
        title="Customer timeline"
        body="Completed, current, and upcoming milestones — no internal financial data."
      />
    </Screen>
  );
}
