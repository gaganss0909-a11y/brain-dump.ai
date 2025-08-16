
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session?.customer_details?.email || !session?.amount_total) {
        return NextResponse.json({ error: "Missing session details" }, { status: 400 });
      }

      const customerEmail = session.customer_details.email;
      const priceId = session.line_items?.data[0].price?.id;

      let subscriptionTier: "Monthly" | "Yearly" | "Free" = "Free";
      // This is a simplified mapping. In a real app, you might store this mapping elsewhere.
      if (priceId === "price_1RwljYLivI9SQBv0HjGDpRZp") { // Your Monthly Price ID
        subscriptionTier = "Monthly";
      } else if (priceId === "price_1RwlUDLivI9SQBv0tV4P49ww") { // Your Yearly Price ID
        subscriptionTier = "Yearly";
      }
      
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", customerEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error(`No user found with email: ${customerEmail}`);
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        // Assuming one user per email
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          subscriptionTier: subscriptionTier,
        });
        
        console.log(`Successfully updated subscription for ${customerEmail} to ${subscriptionTier}`);

      } catch (error) {
        console.error("Error updating user subscription in Firestore:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      break;
    
    // ... handle other event types
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// You need to add your Stripe secret key to the .env file for this to work.
// STRIPE_SECRET_KEY=sk_test_...
