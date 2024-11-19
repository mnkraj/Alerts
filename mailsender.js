const nodemailer = require("nodemailer")

const mailSender = async (title, path) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    })

    let info = await transporter.sendMail({
      from: `"AUTOMATED NOTICE ALERT SYSTEM" <${process.env.MAIL_USER}>`, // sender address
      to: `${process.env.MAIL_USER_RECEPIENT }`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${path}`, // html body
    })
    console.log(info.response)
    return info
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

module.exports = mailSender
