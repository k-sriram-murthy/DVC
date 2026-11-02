import React from "react";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";

export function SitePhotosScreen() {
  return (
    <Screen title="Site photos" subtitle="Internal and customer-visible">
      <PlaceholderCard
        title="Phase 4"
        body="Upload gallery with visibility controls. Customers only see photos marked customer-visible."
      />
    </Screen>
  );
}
