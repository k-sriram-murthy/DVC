import { prisma } from "../lib/prisma.js";

export async function writeAudit(input: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: unknown;
  newValues?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      oldValues: input.oldValues as object | undefined,
      newValues: input.newValues as object | undefined,
    },
  });
}
