import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { CheckCircle2, MoveRight } from 'lucide-react';

const features = [
  {
    title: 'Instant Structure',
    description: 'Paste your raw app idea and watch our AI organize it into a coherent plan.',
  },
  {
    title: 'Smart Suggestions',
    description: 'Receive AI-powered suggestions for features, tech stacks, and integrations.',
  },
  {
    title: 'Actionable Steps',
    description: 'Get a clear, step-by-step development roadmap to bring your idea to life.',
  },
  {
    title: 'Download & Go',
    description: 'Easily download your generated plan in Markdown format to share or use anywhere.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter font-headline">
                  BrainDump.io
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                  From a fleeting thought to a full-fledged plan. BrainDump.io uses AI to instantly structure your app ideas into actionable development roadmaps.
                </p>
              </div>
              <div className="w-full max-w-sm sm:max-w-md mx-auto">
                 <Link href="/dashboard">
                    <Button size="lg" className="w-full group">
                      Get Started <MoveRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything you need to get building</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered tool is designed to help you move from idea to execution faster than ever.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 lg:gap-16 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-2">
                   <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 BrainDump.io. All rights reserved.</p>
      </footer>
    </div>
  );
}
