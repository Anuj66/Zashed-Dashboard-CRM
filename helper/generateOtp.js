const generateOtp = (otpLength) => {
  let add = 1,
    max = 12 - add;

  if (otpLength > max) {
    return generate(max) + generate(otpLength - max);
  }

  max = Math.pow(10, otpLength + add);
  let min = max / 10;
  let number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
};

module.exports = generateOtp;
