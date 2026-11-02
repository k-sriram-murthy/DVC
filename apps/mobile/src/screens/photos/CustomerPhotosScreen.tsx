import React from "react";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";

export function CustomerPhotosScreen() {
  return (
    <Screen title="Photos" subtitle="Shared site updates">
      <PlaceholderCard title="Customer gallery" body="Only photos marked customer-visible for your project." />
    </Screen>
  );
}
