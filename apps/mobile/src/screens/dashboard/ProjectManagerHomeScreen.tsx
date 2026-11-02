import React from "react";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";
import { useAuth } from "../../hooks/useAuth";

export function ProjectManagerHomeScreen() {
  const { user } = useAuth();
  return (
    <Screen title="Project manager" subtitle={`Assigned projects for ${user?.name ?? "PM"}`}>
      <PlaceholderCard
        title="Project switcher (Phase 4)"
        body="This shell only shows projects assigned to you. Budget, progress, and pending reviews will load from the API."
      />
    </Screen>
  );
}
