// src/app/api/test-nextauth-email/route.ts

// FIXED: src/app/api/test-nextauth-email/route.ts
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
        server: {
          host: emailProvider.options.server.host,
          port: emailProvider.options.server.port,
          // REMOVED: auth details for security
          auth: '***' // Don't expose actual credentials
        },
        from: emailProvider.options.from,
      },
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

