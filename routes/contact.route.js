const express = require("express");
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../controller/contact.controller");

const router = express.Router();

router.get("/", getContacts);
router.post("/create", createContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
