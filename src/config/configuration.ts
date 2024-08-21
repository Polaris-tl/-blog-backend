export default () => ({
  port: parseInt(process.env.PORT, 10),
  jwt: {
    secretKey: process.env.SECRET_KEY,
    expiresIn: process.env.EXPIRES_IN,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  email: {
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  alert: {
    enable: process.env.ALERT_ENABLE === '1',
    email: process.env.ALERT_EMAIL,
    timeoutSeconds: parseInt(process.env.ALERT_TIMEOUT_SECONDS, 10),
  },
});
