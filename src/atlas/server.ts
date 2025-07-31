import { AtlasNextServerClient } from "@runonatlas/next/server";
import { cookies, headers } from "next/headers";
import { DiceUsageTracker } from "@/lib/dice-usage-tracker";

async function getMockUserId(): Promise<string | null> {
  try {
    // Get the authorization header
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    console.log('🔍 Atlas Server - getMockUserId called');
    console.log('🔍 Atlas Server - Auth header:', authHeader);
    
    if (authHeader && authHeader.startsWith('Bearer mock-token-')) {
      // Extract user ID from mock token
      const userId = authHeader.replace('Bearer mock-token-', '');
      console.log('✅ Atlas Server - Extracted userId:', userId);
      return userId;
    }

    // Fallback: try to get from cookies (for cases where header isn't available)
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('mock-auth-token');
    
    
    if (authCookie && authCookie.value.startsWith('mock-token-')) {
      const userId = authCookie.value.replace('mock-token-', '');
      return userId;
    }

    return null;
  } catch (error) {
    console.error('❌ Atlas Server - Error getting mock user ID:', error);
    return null;
  }
}

export const atlasServerClient = new AtlasNextServerClient(
  getMockUserId,
   {
     limits: {
       "dice-rolls": async (userId: string) => {
         try {
           // Count the user's dice rolls for the current month
           console.log('🎲 Dice limit callback - userId:', userId);
           const rollCount = DiceUsageTracker.getRollCount(userId);
           console.log('🎲 Dice limit callback - rollCount:', rollCount);
           return rollCount;
         } catch (error) {
           console.error('❌ Dice limit callback error:', error);
           // Return 0 on error to prevent 500s
           return 0;
         }
       }
     }
   }
);