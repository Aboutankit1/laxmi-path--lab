const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Test = require("../models/Test");
const Settings = require("../models/Settings");

const tests = [
  { testCode: "CBC", name: "Complete Blood Count", category: "Hematology", sampleType: "Blood", price: 350, reportTimeHours: 12 },
  { testCode: "BSUG", name: "Blood Sugar (Fasting)", category: "Biochemistry", sampleType: "Blood", price: 150, reportTimeHours: 6 },
  { testCode: "HBA1C", name: "HbA1c", category: "Biochemistry", sampleType: "Blood", price: 550, reportTimeHours: 24 },
  { testCode: "LIPID", name: "Lipid Profile", category: "Biochemistry", sampleType: "Blood", price: 700, reportTimeHours: 24 },
  { testCode: "LFT", name: "Liver Function Test", category: "Biochemistry", sampleType: "Blood", price: 800, reportTimeHours: 24 },
  { testCode: "KFT", name: "Kidney Function Test", category: "Biochemistry", sampleType: "Blood", price: 750, reportTimeHours: 24 },
  { testCode: "THYRO", name: "Thyroid Profile", category: "Endocrinology", sampleType: "Blood", price: 600, reportTimeHours: 24 },
  { testCode: "VITD", name: "Vitamin D", category: "Endocrinology", sampleType: "Blood", price: 1200, reportTimeHours: 48 },
  { testCode: "VITB12", name: "Vitamin B12", category: "Endocrinology", sampleType: "Blood", price: 900, reportTimeHours: 48 },
  { testCode: "DENGUE", name: "Dengue NS1/IgG/IgM", category: "Serology", sampleType: "Blood", price: 900, reportTimeHours: 12 },
  { testCode: "MALAR", name: "Malaria Antigen", category: "Serology", sampleType: "Blood", price: 400, reportTimeHours: 6 },
  { testCode: "COVID", name: "COVID-19 RT-PCR", category: "Molecular", sampleType: "Swab", price: 500, reportTimeHours: 24 },
  { testCode: "PREG", name: "Pregnancy Test (Beta hCG)", category: "Endocrinology", sampleType: "Blood", price: 300, reportTimeHours: 6 },
  { testCode: "URINE", name: "Urine Routine", category: "Pathology", sampleType: "Urine", price: 150, reportTimeHours: 6 },
  { testCode: "STOOL", name: "Stool Routine", category: "Pathology", sampleType: "Stool", price: 150, reportTimeHours: 6 },
];

const run = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email: "superadmin@laxmipathlab.com" });
  if (!existingAdmin) {
    await User.create({
      name: "Super Admin",
      email: "superadmin@laxmipathlab.com",
      password: "Admin@12345",
      role: "superadmin",
    });
    console.log("[Seed] Super Admin created -> superadmin@laxmipathlab.com / Admin@12345");
  } else {
    console.log("[Seed] Super Admin already exists");
  }

  for (const t of tests) {
    const exists = await Test.findOne({ testCode: t.testCode });
    if (!exists) await Test.create(t);
  }
  console.log(`[Seed] ${tests.length} default tests ensured`);

  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({
      labName: "Laxmi Path Lab",
      address: "123 Health Street, Delhi, India",
      contactNumber: "+91-9876543210",
      email: "info@laxmipathlab.com",
    });
    console.log("[Seed] Default lab settings created");
  }

  console.log("[Seed] Done.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
