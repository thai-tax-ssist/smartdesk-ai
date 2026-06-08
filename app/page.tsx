import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PricingTable } from '@/components/landing/PricingTable';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { createClient } from '@/lib/supabase/server';

async function getEarlyBirdCount() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('early_bird_counter').select('count').single();
    return data?.count ?? 47;
  } catch {
    return 47;
  }
}

export default async function LandingPage() {
  const earlyBirdCount = await getEarlyBirdCount();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <PricingTable earlyBirdCount={earlyBirdCount} />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
