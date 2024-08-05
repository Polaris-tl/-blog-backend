export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secretKey: process.env.SECRET_KEY || 'SOME_SECRET_KEY',
    expiresIn: process.env.EXPIRES_IN || '1d',
  },
  database: {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '1234qwer',
    database: process.env.DATABASE_NAME || 'blog',
  },
});
