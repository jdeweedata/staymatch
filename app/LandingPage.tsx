"use client";

import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import SocialProof from "@/components/landing/SocialProof";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
