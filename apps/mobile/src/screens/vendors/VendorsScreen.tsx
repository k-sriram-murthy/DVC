import React from "react";
import { Screen } from "../../components/Screen";
import { PlaceholderCard } from "../../components/PlaceholderCard";

export function VendorsScreen() {
  return (
    <Screen title="Vendors" subtitle="Material suppliers and labour contractors">
      <PlaceholderCard
        title="Phase 2"
        body="Vendor list with outstanding balances calculated from invoices, payments, and allocations."
      />
    </Screen>
  );
}
