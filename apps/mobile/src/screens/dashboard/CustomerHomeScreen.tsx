import React from "react";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";
import { useAuth } from "../../hooks/useAuth";

export function CustomerHomeScreen() {
  const { user } = useAuth();
  return (
    <Screen title="Your project" subtitle={`Hello, ${user?.name ?? "Customer"}`}>
      <PlaceholderCard
        title="Progress overview"
        body="Customers see only their assigned project progress, customer-visible photos, and shared documents — never internal vendor spend or approvals."
      />
    </Screen>
  );
}
