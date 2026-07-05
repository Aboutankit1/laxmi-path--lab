const express = require("express");
const { createTest, getTests, getTestById, updateTest, deleteTest } = require("../controllers/testController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(getTests).post(authorize("superadmin", "admin"), createTest);
router
  .route("/:id")
  .get(getTestById)
  .put(authorize("superadmin", "admin"), updateTest)
  .delete(authorize("superadmin", "admin"), deleteTest);

module.exports = router;
