const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const {
  addWorkspace,
  addInvites,
  addProject,
  addWorkspaceMember,
  getWorkspaceInvites,
  updateWorkspaceInvite,
} = require("../controller/onboarding.controller");

const router = express.Router();

router.post("/add-workspace", authenticateToken, addWorkspace);
router.post("/add-workspace-member", authenticateToken, addWorkspaceMember);
router.post("/add-invites", authenticateToken, addInvites);
router.post("/add-project", authenticateToken, addProject);
router.get("/workspace-invites", getWorkspaceInvites);
router.patch("/workspace-invites/:id", updateWorkspaceInvite);

module.exports = router;
