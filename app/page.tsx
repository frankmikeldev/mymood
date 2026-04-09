import Hero              from "@/components/landing/Hero";
import Features          from "@/components/landing/Features";
import AnonymousSection  from "@/components/landing/AnonymousSection";
import Testimonials      from "@/components/landing/Testimonials";
import FAQ               from "@/components/landing/FAQ";
import CTASection        from "@/components/landing/CTASection";
import SubscribeSection  from "@/components/landing/SubscribeSection";

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen bg-[#F5F0E8] overflow-hidden"
      style={{ fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif" }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <Hero />
      <Features />
      <AnonymousSection />
      <Testimonials />
      <FAQ />
      <CTASection />
      <SubscribeSection />
    </main>
  );
}