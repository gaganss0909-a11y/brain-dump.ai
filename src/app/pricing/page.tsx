
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    features: [
      "1 Generation per month",
      "Basic support",
    ],
    cta: "Start for Free",
    href: "/dashboard"
  },
  {
    name: "Monthly",
    price: "$10",
    period: "/ month",
    features: [
      "Unlimited Generations",
      "Priority support",
      "Access to new features",
    ],
    cta: "Choose Monthly",
    href: "https://buy.stripe.com/your_monthly_price_id" // Placeholder for Stripe checkout link
  },
  {
    name: "Yearly",
    price: "$50",
    period: "/ year",
    features: [
        "Unlimited Generations",
        "Priority support",
        "Access to new features",
        "Save over 50%",
    ],
    cta: "Choose Yearly",
    href: "https://buy.stripe.com/price_1Rwkm1EgC7zAkK6POlWUzq8C"
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                Choose Your Plan
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                Simple, transparent pricing. No hidden fees.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {tiers.map((tier) => (
                <Card key={tier.name} className={tier.name === "Yearly" ? "border-accent shadow-accent/50 shadow-lg" : ""}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="grid gap-2">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={tier.href}>{tier.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             <p className="text-center text-sm text-muted-foreground mt-4">
                Note: To get a real checkout link, replace the placeholder IDs with your actual Stripe Price IDs.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
