module.exports = {
    user: process.env.DATABASE_USER,
    pwd: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT,
    db: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    authentication: {
        secret: process.env.JWT_SECRET
    }
};
