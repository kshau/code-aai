import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_EMAIL,
        pass: process.env.NODE_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODE_EMAIL,
      to,
      subject,
      html: text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
