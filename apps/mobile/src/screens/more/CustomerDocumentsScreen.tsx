import React from "react";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";

export function CustomerDocumentsScreen() {
  return (
    <Screen title="Documents" subtitle="Shared project files">
      <PlaceholderCard title="Customer documents" body="Only documents explicitly shared with the customer." />
    </Screen>
  );
}
