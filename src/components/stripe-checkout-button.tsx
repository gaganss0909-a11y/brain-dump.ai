
"use client";

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutButtonProps {
    priceId: string;
    children: React.ReactNode;
}

export function StripeCheckoutButton({ priceId, children }: StripeCheckoutButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        const stripe = await stripePromise;
        if (!stripe) {
            console.error("Stripe.js has not loaded yet.");
            setLoading(false);
            return;
        }
        
        // When the customer clicks on the button, redirect them to Checkout.
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            // Make sure to change this to your production U
            successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/pricing`,
        });

        // If `redirectToCheckout` fails due to a browser popup blocker,
        // display the localized error message to your customer.
        if (error) {
            console.warn('Error:', error.message);
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleClick} className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : children}
        </Button>
    );
}
