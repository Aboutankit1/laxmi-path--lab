const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html, attachments }) => {
  if (!process.env.SMTP_USER) {
    console.log(`[Mailer] SMTP not configured. Skipped email to ${to}: ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Laxmi Path Lab <no-reply@laxmipathlab.com>",
    to,
    subject,
    html,
    attachments,
  });
};

module.exports = { sendEmail };
