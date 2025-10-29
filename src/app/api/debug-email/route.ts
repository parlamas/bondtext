// src/app/api/debug-email/route.ts
export async function GET() {
  const envVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD ? 'Set' : 'Missing',
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
    NODE_ENV: process.env.NODE_ENV,
  };

  return Response.json(envVars);
}