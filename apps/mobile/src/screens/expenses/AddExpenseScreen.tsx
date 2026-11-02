import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { ExpenseType, formatINR, todayISODate } from "@dvc/shared";
import { Screen } from "../../components/Screen";
import { colors, radii, spacing } from "../../theme";

/**
 * Structured fast-path expense entry (PRD §8 / §10).
 * Phase 1: form structure + local validation only.
 * Persist / photo upload / allocations land in Phase 2.
 */
export function AddExpenseScreen() {
  const [expenseType, setExpenseType] = useState<ExpenseType>(ExpenseType.MATERIAL);
  const [project, setProject] = useState("BVR Nagar Villa");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate] = useState(todayISODate());
  const [materialName, setMaterialName] = useState("");
  const [labourCategory, setLabourCategory] = useState("");

  const amountPreview = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) && amount !== "" ? formatINR(n, { fixed: true }) : "₹—";
  }, [amount]);

  const submit = (mode: "draft" | "submit") => {
    if (!vendor.trim() || !amount.trim()) {
      Alert.alert("Missing fields", "Vendor and amount are required for the fast path.");
      return;
    }
    Alert.alert(
      mode === "draft" ? "Draft saved locally (scaffold)" : "Submit queued (scaffold)",
      `${expenseType} · ${project} · ${amountPreview}\nAPI persistence is Phase 2.`,
    );
  };

  return (
    <Screen
      title="Add expense"
      subtitle="Fast path: project → type → vendor → amount → invoice → submit"
    >
      <View style={styles.segment}>
        <Seg
          label="Material"
          active={expenseType === ExpenseType.MATERIAL}
          onPress={() => setExpenseType(ExpenseType.MATERIAL)}
        />
        <Seg
          label="Labour"
          active={expenseType === ExpenseType.LABOUR}
          onPress={() => setExpenseType(ExpenseType.LABOUR)}
        />
      </View>

      <Field label="Project (prefilled when only one assigned)" value={project} onChange={setProject} />
      <Field label="Vendor" value={vendor} onChange={setVendor} placeholder="Recent vendors soon" />
      <Field
        label="Amount (INR)"
        value={amount}
        onChange={setAmount}
        placeholder="248000"
        keyboardType="decimal-pad"
      />
      <Text style={styles.preview}>{amountPreview}</Text>
      <Field
        label="Invoice number (optional)"
        value={invoiceNumber}
        onChange={setInvoiceNumber}
        placeholder="INV-…"
      />
      <Text style={styles.meta}>Transaction date: {transactionDate} (defaults to today)</Text>

      {expenseType === ExpenseType.MATERIAL ? (
        <Field
          label="Material name (optional for simple totals)"
          value={materialName}
          onChange={setMaterialName}
          placeholder="Cement, steel, …"
        />
      ) : (
        <Field
          label="Labour category (optional)"
          value={labourCategory}
          onChange={setLabourCategory}
          placeholder="Masonry, steel fixing, …"
        />
      )}

      <Field
        label="Description / purpose"
        value={description}
        onChange={setDescription}
        placeholder="Short purpose"
        multiline
      />

      <Pressable style={styles.attach}>
        <Text style={styles.attachText}>Capture / upload invoice (Phase 2)</Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable style={styles.secondary} onPress={() => submit("draft")}>
          <Text style={styles.secondaryText}>Save draft</Text>
        </Pressable>
        <Pressable style={styles.primary} onPress={() => submit("submit")}>
          <Text style={styles.primaryText}>Submit for approval</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function Seg({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.seg, active && styles.segActive]}>
      <Text style={[styles.segText, active && styles.segTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "decimal-pad";
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.grey400}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: "row",
    backgroundColor: colors.grey100,
    borderRadius: radii.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  seg: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: radii.sm,
  },
  segActive: { backgroundColor: colors.navy },
  segText: { fontWeight: "600", color: colors.grey700 },
  segTextActive: { color: colors.white },
  field: { marginBottom: spacing.sm },
  label: { fontSize: 13, color: colors.grey700, marginBottom: 4 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputMulti: { minHeight: 72, textAlignVertical: "top" },
  preview: {
    marginBottom: spacing.sm,
    color: colors.tealDark,
    fontWeight: "700",
  },
  meta: { color: colors.textSecondary, marginBottom: spacing.sm, fontSize: 13 },
  attach: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.teal,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: "center",
    marginVertical: spacing.sm,
    backgroundColor: colors.tealLight,
  },
  attachText: { color: colors.tealDark, fontWeight: "600" },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryText: { color: colors.navy, fontWeight: "700" },
  primary: {
    flex: 1.4,
    backgroundColor: colors.teal,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: colors.white, fontWeight: "700" },
});
