import React from "react";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";

export function ActivitiesScreen() {
  return (
    <Screen title="Activities" subtitle="Assigned site work">
      <PlaceholderCard
        title="Progress updates (Phase 4)"
        body="Historical progress reports with weighted project rollups — not a simple average of activity %."
      />
    </Screen>
  );
}
