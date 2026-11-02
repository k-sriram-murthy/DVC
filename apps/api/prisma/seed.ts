import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

  const director = await prisma.user.upsert({
    where: { email: "director@dvc.local" },
    update: {},
    create: {
      name: "Sriram Murthy",
      email: "director@dvc.local",
      mobile: "9000000001",
      passwordHash,
      role: "DIRECTOR",
    },
  });

  const pm = await prisma.user.upsert({
    where: { email: "pm@dvc.local" },
    update: {},
    create: {
      name: "Priya Manager",
      email: "pm@dvc.local",
      mobile: "9000000002",
      passwordHash,
      role: "PROJECT_MANAGER",
    },
  });

  const supervisor = await prisma.user.upsert({
    where: { email: "supervisor@dvc.local" },
    update: {},
    create: {
      name: "Ravi Supervisor",
      email: "supervisor@dvc.local",
      mobile: "9000000003",
      passwordHash,
      role: "SITE_SUPERVISOR",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@dvc.local" },
    update: {},
    create: {
      name: "Anand Customer",
      email: "customer@dvc.local",
      mobile: "9000000004",
      passwordHash,
      role: "CUSTOMER",
    },
  });

  const categories = [
    "Civil Work",
    "Structural Work",
    "Materials",
    "Labour",
    "Electrical",
    "Plumbing",
    "Finishing",
    "Other",
  ];
  for (const name of categories) {
    await prisma.budgetCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const project = await prisma.project.upsert({
    where: { projectCode: "BVR-001" },
    update: {},
    create: {
      projectCode: "BVR-001",
      name: "BVR Nagar Villa",
      location: "BVR Nagar, Hyderabad",
      description: "Residential villa construction (seed project)",
      approvedBudget: 24000000,
      customerId: customer.id,
      createdById: director.id,
      startDate: new Date("2026-01-15"),
      expectedCompletionDate: new Date("2026-12-31"),
      status: "ACTIVE",
    },
  });

  await prisma.projectAssignment.upsert({
    where: {
      projectId_userId_assignmentRole: {
        projectId: project.id,
        userId: pm.id,
        assignmentRole: "PROJECT_MANAGER",
      },
    },
    update: { active: true },
    create: {
      projectId: project.id,
      userId: pm.id,
      assignmentRole: "PROJECT_MANAGER",
    },
  });

  await prisma.projectAssignment.upsert({
    where: {
      projectId_userId_assignmentRole: {
        projectId: project.id,
        userId: supervisor.id,
        assignmentRole: "SITE_SUPERVISOR",
      },
    },
    update: { active: true },
    create: {
      projectId: project.id,
      userId: supervisor.id,
      assignmentRole: "SITE_SUPERVISOR",
    },
  });

  await prisma.vendor.upsert({
    where: { id: "seed-vendor-balaji" },
    update: {},
    create: {
      id: "seed-vendor-balaji",
      name: "Sri Balaji Steels",
      vendorType: "MATERIAL",
      mobile: "9888877777",
      contactPerson: "Balaji",
    },
  });

  console.log("Seed complete.");
  console.log("Demo logins (password: ChangeMe123!):");
  console.log("  director@dvc.local");
  console.log("  pm@dvc.local");
  console.log("  supervisor@dvc.local");
  console.log("  customer@dvc.local");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
