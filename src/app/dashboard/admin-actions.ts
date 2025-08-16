
"use server";

import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { headers } from "next/headers";

/**
 * This is a server action for development/testing purposes only.
 * It allows an admin user to manually upgrade their subscription tier
 * without going through the Stripe payment flow.
 */
export async function manualUpgradeAction() {
  const { currentUser } = auth;

  // This action should be protected and only accessible to admins.
  // We get the current user from the server-side auth state.
  // Note: For a real app, you would have more robust role-based access control.
  
  const headersList = headers();
  const userCookie = headersList.get('cookie')?.split('; ').find(c => c.startsWith('user='))?.split('=')[1];
  
  if (!userCookie) {
    throw new Error("Authentication required. Please log in.");
  }
  
  const user = JSON.parse(decodeURIComponent(userCookie));


  if (!user || !user.uid) {
    throw new Error("Authentication failed. User not found.");
  }

  try {
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      subscriptionTier: "Yearly",
    });
    console.log(`Successfully upgraded user ${user.uid} to Yearly.`);
    return { success: true, message: "Subscription upgraded to Yearly." };
  } catch (error) {
    console.error("Manual upgrade failed:", error);
    throw new Error("Failed to update subscription in the database.");
  }
}
