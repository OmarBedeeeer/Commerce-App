import nodemailer from "nodemailer";
interface MailOptions {
  to: string | string[];
  subject: string;
  text: string;
}
const sendmail = async ({ to, subject, text }: MailOptions) => {
  //sender
  const transporter = nodemailer.createTransport({
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  //recevier
  const info = await transporter.sendMail({
    from: `"Alert Alert 📩", <${process.env.EMAIL}> `,
    to,
    subject,
    text,
  });
  if (info.rejected.length > 0) return false; //
  return true;
};
export default sendmail;
