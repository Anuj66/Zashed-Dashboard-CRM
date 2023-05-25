const ADMIN_ROLE_ID = 1;
const CLIENT_ROLE_ID = 2;
const JWT_KEY = "Zashed Fashion Secret Key";
const SMTP_HOST = "smtp.ethereal.email";
const SMTP_PORT = 587;
const SMTP_USER = "abigayle.wyman@ethereal.email";
const SMTP_PASSWORD = "EpdjxUTCyj5f9hDwsw";
const TMP_UPLOAD_PATH = "./assets/tmp";
const UPLOAD_BASE_PATH = "./assets/uploads";

const getMonthName = (monthNo) => {
  if (monthNo == 1) return "January";
  if (monthNo == 2) return "February";
  if (monthNo == 3) return "March";
  if (monthNo == 4) return "April";
  if (monthNo == 5) return "May";
  if (monthNo == 6) return "June";
  if (monthNo == 7) return "July";
  if (monthNo == 8) return "August";
  if (monthNo == 9) return "September";
  if (monthNo == 10) return "October";
  if (monthNo == 11) return "November";
  if (monthNo == 12) return "December";
};

module.exports = {
  ADMIN_ROLE_ID,
  CLIENT_ROLE_ID,
  JWT_KEY,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
  TMP_UPLOAD_PATH,
  UPLOAD_BASE_PATH,
  getMonthName,
};
