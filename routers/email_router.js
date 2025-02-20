const express = require("express");
const { sendBulkEmails } = require("../services/email_service"); // Use require instead of import

const router = express.Router();

router.post("/send-emails", async (req, res) => {
  const { subject, body } = req.body;
  
  if (!subject || !body) {
    return res.status(400).json({ error: "Subject and body are required" });
  }

  try {
    sendBulkEmails(subject, body);
    res.json({ message: "Emails are being sent..." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
