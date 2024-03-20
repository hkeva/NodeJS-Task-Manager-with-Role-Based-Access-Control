import transporter from "@src/config/mail";
import dotenv from "dotenv";

dotenv.config();

export const sendEmailToMe = async (
  name: string,
  email: string,
  message: string
) => {
  const mailOptions = {
    from: `${name} <${email}> `,
    to: "humayraeva@gmail.com",
    subject: `Hello from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n${message}`,
  };

  const replyMailOptions = {
    from: `Humayra Khatun <humayraeva@gmail.com> `,
    to: email,
    subject: `Thank You for Reaching Out`,
    html: `<body style="font-family: Arial, sans-serif;">
    <p style="margin: 5px 0;">Dear ${name},</p>

    <p style="margin: 0;">
      I hope this email finds you well. I wanted to take a moment to express my gratitude for reaching out to me. Your message is genuinely appreciated.
    </p>
    <br/>
     <p style="margin: 0;">
      Thank you for taking the time to connect with me. I value your communication and look forward to further interactions.
    </p>
    <br/>
    <p style="margin: 0;">Warm regards,</p>
    <p style="margin: 0;">Humayra Khatun</p>
  </body>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  transporter.sendMail(replyMailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email replied: " + info.response);
    }
  });
};
