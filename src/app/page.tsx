import { Hero } from "@/components/sections/Hero";
import { ValueProps } from "@/components/sections/ValueProps";
import { RegionShowcase } from "@/components/sections/RegionShowcase";
import { Listings } from "@/components/sections/Listings";
import { LeadMagnet } from "@/components/sections/LeadMagnet";
import { About } from "@/components/sections/About";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <RegionShowcase />
      <Listings />
      <LeadMagnet />
      <About />
    </>
  );
}
