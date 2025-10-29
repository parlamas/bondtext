// app/api/test-gmail/route.ts
export async function GET() {
  const config = {
    hasAllEmailVars: !!(process.env.EMAIL_SERVER_HOST && 
                       process.env.EMAIL_SERVER_USER && 
                       process.env.EMAIL_SERVER_PASSWORD && 
                       process.env.EMAIL_FROM),
    emailHost: process.env.EMAIL_SERVER_HOST,
    emailUser: process.env.EMAIL_SERVER_USER,
    emailPasswordSet: !!process.env.EMAIL_SERVER_PASSWORD,
    emailFrom: process.env.EMAIL_FROM,
    nextauthUrl: process.env.NEXTAUTH_URL,
  };

  return Response.json(config);
}