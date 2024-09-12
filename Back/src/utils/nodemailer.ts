import nodemailer from "nodemailer";
interface MailOptions {
  to: string | string[];
  subject: string;
  text: string;
}
interface SendMailOptions {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
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
  } as SendMailOptions);
  if (info.rejected.length > 0) return false; //
  return true;
};
export default sendmail;
