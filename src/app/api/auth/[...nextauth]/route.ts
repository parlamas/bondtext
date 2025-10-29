//src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/auth'; // Go up 4 levels from api/auth/[...nextauth]

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };