interface Env {
  DB: D1Database;
  APP_ORIGIN?: string;
  EMAIL_FROM?: string;
  ENVIRONMENT?: "development" | "production";
  RESEND_API_KEY?: string;
}
