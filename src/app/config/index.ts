import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  NODE_ENV: process.env.DB_URL,
  activation_secret: process.env.ACTIVATION_SECRET,
  smtp_mail: process.env.SMTP_Mail,
  smtp_password: process.env.SMTP_PASSWORD,
  access_token_expire: process.env.ACCESS_TOKEN_EXPIRE,
  refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRE,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
};
