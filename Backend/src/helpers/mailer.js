import { env } from "../config/env.js";
import nodemailer from "nodemailer";


export const sendMailer = async (key, username,to,) => { 
    const htmlBody = `
    <!DOCTYPE html>
<html lang="hy">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6fb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#333;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:12px; overflow:hidden;">
    <tr>
      <td style="text-align:center; background:linear-gradient(135deg, #4A90E2, #6A60FA); padding:40px 20px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" width="64" height="64">
          <rect width="64" height="48" y="8" rx="8" ry="8" fill="#fff"/>
          <path d="M4 12l28 20L60 12" stroke="#4A90E2" stroke-width="4" fill="none"/>
        </svg>
        <h1 style="color:#fff; font-size:24px; margin:20px 0 0;">Բարի գալուստ 🌟</h1>
        <p style="color:#e9e9e9; font-size:16px; margin-top:8px;">Հաստատիր քո էլ․ հասցեն շարունակելու համար</p>
      </td>
    </tr>
    <tr>
      <td style="padding:40px 30px; text-align:center;">
        <p style="font-size:16px; line-height:1.6; margin-bottom:30px;">
          Ողջույն Հարգելի ${username}, շնորհակալություն գրանցվելու համար։  
          Խնդրում ենք հաստատել ձեր էլ․ հասցեն՝ ակտիվացնելու ձեր հաշիվը։
        </p>
        <a href="${env.url}:${env.port}/verify/${key}" 
           style="background:linear-gradient(135deg, #4A90E2, #6A60FA); color:#fff; text-decoration:none; padding:14px 32px; border-radius:50px; font-weight:600; font-size:16px; display:inline-block;">
          Հաստատել էլ․ հասցեն
        </a>
      </td>
    </tr>
    <tr>
      <td style="text-align:center; padding:30px 20px; background-color:#f9fafc; font-size:13px; color:#777;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4A90E2" style="vertical-align:middle;">
          <path d="M10 18s-6-4.35-6-9a6 6 0 0112 0c0 4.65-6 9-6 9z"/>
        </svg>
        <p style="margin-top:8px;">Եթե դուք չեք խնդրել այս նամակը, պարզապես անտեսեք այն։</p>
      </td>
    </tr>
  </table>
</body>
</html>



  `

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: env.APP_GMAIL, // քո gmail հասցեն
                pass: env.APP_PASS,   // Gmail App Password-ը
            },
        });

        const mailOptions = {
            from: env.APP_GMAIL,
            to,
            subject: "Verification Code",
            html: htmlBody, // կարող ես օգտագործել html էլ՝ html: "<b>Hello</b>"
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (err) {
        throw err;
    }
}