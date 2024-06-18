import nodemailer from 'nodemailer'
const  sendMail = async (email, userid, token) => {
  // Send Email using credentials
const transporter = nodemailer. createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    }
  })

 try {
    const info =await transporter.sendMail({
        from: "connectplus@gmail.com",
        to:email,
        subject: "Account verification",
        text: `Hello, please verify your account by clicking this link below. ${process.env.NODE_ENV === "development" ? "http://localhost:3000":"https://x-clone-xast.onrender.com"}/verify/user/${userid}/${token}`,
      })
      console.log("verification link sent", info.messageId)
 } catch (error) {
    console.log("Error in sending link", error)
    process.exit(1)
 }
}

export default sendMail