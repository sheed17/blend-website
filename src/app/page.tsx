import { Belief } from "@/components/sections/Belief";
import { Facts } from "@/components/sections/Facts";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Outcomes } from "@/components/sections/Outcomes";
import { ScrollExpandVideo } from "@/components/sections/ScrollExpandVideo";
import { Team } from "@/components/sections/Team";
import { Vision } from "@/components/sections/Vision";
import { WhyUnclaimed } from "@/components/sections/WhyUnclaimed";

export default function Home() {
  return (
    <>
      <Hero />
      <Belief />
      <Facts />
      <WhyUnclaimed />
      <HowItWorks />
      <ScrollExpandVideo />
      <Outcomes />
      <Vision />
      <Team />
      <Faq />
    </>
  );
}
