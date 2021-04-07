export const smtpConfig = {
  host: String(process.env.MAIL_HOST),
  port: Number(process.env.MAIL_PORT),
  secure: Boolean(process.env.MAIL_ENCRYPTION),
  requireTLS: Boolean(process.env.MAIL_REQUIRE_TLS),
  auth: {
    user: String(process.env.MAIL_USERNAME),
    pass: String(process.env.MAIL_PASSWORD),
  },
};
