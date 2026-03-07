import { Starfield } from "@/components/starfield";
import { FloatingParticles } from "@/components/floating-particles";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { ExperienceSection } from "@/components/experience-section";
import { AudienceSection } from "@/components/audience-section";
import { WaitlistSection } from "@/components/waitlist-section";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function Page() {
  return (
    <div className="landing-page">
      <Starfield />
      <FloatingParticles />
      <HeroSection />
      <FeaturesSection />
      <ExperienceSection />
      <AudienceSection />
      <WaitlistSection />
      <Footer />
      <ScrollReveal />
    </div>
  );
}
