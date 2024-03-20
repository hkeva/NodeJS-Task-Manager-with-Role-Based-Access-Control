import transporter from "@src/config/mail";
import dotenv from "dotenv";

dotenv.config();

export const sendEmailVerificationMail = async (
  email: string,
  username: string,
  token: string
) => {
  const verificationLink = `${process.env.LOCAL_URI}/user/verify-user/${token}`;
  const mailOptions = {
    from: "TASK MANAGEMENT APP <emails.handler@gmail.com> ",
    to: email,
    subject: "Please verify you email",
    html: `
      <table style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border-collapse: collapse;">
      <tr>
          <td style="background-color: #007bff; color: #fff; padding: 10px; text-align: center;">
              <h2>Email Verification</h2>
          </td>
      </tr>
      <tr>
          <td style="padding: 20px;">
              <p>Dear ${username},</p>
              <p>Please click the button below to verify your email address:</p>
              <p>&nbsp;</p>
              <p style="text-align: center;">
                  <a href=${verificationLink} style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
              </p>
              <p>&nbsp;</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Thanks,<br> TASK MANAGEMENT APP</p>
          </td>
      </tr>
  </table>
      `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
