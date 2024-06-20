import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
  // Send Email using credentials
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    }
  })


export default transporter