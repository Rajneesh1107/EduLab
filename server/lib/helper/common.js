require("dotenv").config({ silent: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//hashedPassword function is used to hashed the
const saltRounds = process.env.SALT_ROUND;
exports.hashedPassword = (myPlaintextPassword, saltRound = saltRounds) => {
  console.log();
  const hash = bcrypt.hashSync(myPlaintextPassword, +saltRound);
  return hash;
};

//compare function is for comparing for hashed password;
exports.comparePassword = (myPlaintextPassword, hashedPassword) => {
  const isCorrect = bcrypt.compareSync(myPlaintextPassword, hashedPassword);
  return isCorrect;
};

//password validation fucntion
exports.validatePassword = (password) => {
  if (password.trim().length < 8) {
    return false;
  }

  //check Password has contain upperCase character;

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  //check Password has contain lowerCase character;
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // check Password has contain numerial character;
  if (!/[0-9]/.test(password)) {
    return false;
  }

  //check password has contain special character
  if (!/[!@#$%^&*]/.test(password)) {
    return false;
  }

  `if password length is greater than or equal to 8 and 
   password contain upperCase,lowerCase, numeric and special characters then  
   return true;
  `;
  return true;
};

//generating accessToken
exports.generateAccessToken = (payload, secret) => {
  // Options for the token
  const options = {
    expiresIn: "1d", // Token will expire in 1day
  };

  // Generate the accessToken
  const token = jwt.sign(payload, secret, options);

  return token;
};

//verify access token
exports.verifyAccessToken = (token, secretKey) => {
  try {
    let decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

//secreteRefreshToken Key
const secretRefreshKey = process.env.SECRET_REFRESH_KEY;

exports.generateRereshToken = (payload, secret) => {
  // Options for the token
  const options = {
    expiresIn: "7d", // Token will expire in 2 hours
  };

  // Generate the refreshToken
  const token = jwt.sign(payload, secret, options);

  return token;
};

//verify refresh token
exports.verifyRefreshToken = (token, secretKey) => {
  try {
    let decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return error;
  }
};

`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYyOWVlNDgyZGU5OGI4M2M3ODc5YTkiLCJlbWFpbCI6InNhdXJhYmhAZ21haWwuY29tIiwicm9sZSI6Imluc3RydWN0b3IiLCJpYXQiOjE3MTA0MDgyODEsImV4cCI6MTcxMDQ5NDY4MX0.YheoMECUG70abmZXVILwvmz2p7Y4LQ_19EUCbHOPbSs
`;
