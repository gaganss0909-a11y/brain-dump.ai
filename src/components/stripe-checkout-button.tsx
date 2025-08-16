"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeCheckoutButtonProps {
  priceId: string;
  label: string;
}

export function StripeCheckoutButton({ priceId, label }: StripeCheckoutButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login or show a message if user is not authenticated
      console.error("User is not logged in.");
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js has not loaded yet.");
      }
      
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        // Pass the user's email to pre-fill the checkout form.
        // This is also useful for linking the Stripe customer to your user.
        customerEmail: user.email!,
        // Replace with your actual success and cancel URLs
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading || !user} className="w-full">
      {loading ? <Loader2 className="animate-spin" /> : label}
    </Button>
  );
}
