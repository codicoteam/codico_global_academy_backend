const { auth } = require("../configs/firebase_cofig"); // Ensure auth is imported correctly
const nodemailer = require("nodemailer");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mapmaksoftwaresolutions@gmail.com", // Replace with your email
    pass: "drphypohowmrpspg" // Use an App Password, NOT your real password
  }
});

// Function to get all registered emails
const getAllEmails = async () => {
  let emails = [];
  try {
    const listUsersResult = await auth.listUsers(1000); // Use auth.listUsers()
    listUsersResult.users.forEach(user => {
      if (user.email) {
        emails.push(user.email);
      }
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
  }
  return emails;
};

// Function to send emails with a delay
const sendBulkEmails = async (subject, body) => {
  const emails = await getAllEmails();
  console.log(`Found ${emails.length} emails. Sending emails...`);

  for (const email of emails) {
    try {
      await transporter.sendMail({
        from: "mapmaksoftwaresolutions@gmail.com",
        to: email,
        subject: subject,
        text: body
      });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
  }
};

module.exports = { sendBulkEmails };
