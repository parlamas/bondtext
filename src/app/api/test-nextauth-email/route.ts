// src/app/api/test-nextauth-email/route.ts
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const emailProvider = authOptions.providers?.find((p: any) => p.type === 'email');
    
    if (!emailProvider) {
      return Response.json({ error: 'Email provider not found' });
    }

    return Response.json({
      emailProvider: {
        type: emailProvider.type,
        name: emailProvider.name,
        server: emailProvider.options.server,
        from: emailProvider.options.from,
      },
      // Test if we can send using the same config
      config: {
        host: process.env.EMAIL_SERVER_HOST,
        user: process.env.EMAIL_SERVER_USER,
        from: process.env.EMAIL_FROM,
      }
    });
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}