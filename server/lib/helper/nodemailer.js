require("dotenv").config({});
const nodemailer = require("nodemailer");
const { generateOtp } = require("./common");
const redis_client = require("../db/redisdb");
const { http } = require("./const");

exports.sendOtp = async (email, userName) => {
  try {
    // generating 6 digit's random number for otp;
    const otp = generateOtp();

    //storing otp to redis database;
    await redis_client.setex(email, 300, otp, function (err, res) {
      if (err) {
        console.log(err, "error while setting otp to redis");
        res.status(http.BAD_REQUEST).send({ msg: "error", error });
        return;
      } else {
        console.log(res);
      }
    });

    // nodemailer setups for sending otp via mail.
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });

    var mailOptions = {
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: "Email verification...",
      text: `Hello ${userName},
      Thank you for signing up with our LMS! To complete your registration, 
      please use the following One-Time Password (OTP):${otp}     
      This OTP is valid for 5 minutes. Please do not share it with anyone.      
      If you did not initiate this request, please ignore this email or contact our support.
    
      Sincerely,
      The LMS Team`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("nodemailer error", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return `opt send to email ${email} `;
  } catch (error) {
    console.log(error, "nodemailer Error");
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "error", error });
  }
};
