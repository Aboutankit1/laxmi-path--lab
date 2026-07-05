// Sequential-style human-friendly ID generator, e.g. PT-2026-00001
const generateSequentialId = async (Model, field, prefix) => {
  const year = new Date().getFullYear();
  const count = await Model.countDocuments({ [field]: { $regex: `^${prefix}-${year}-` } });
  const next = String(count + 1).padStart(5, "0");
  return `${prefix}-${year}-${next}`;
};

module.exports = generateSequentialId;
