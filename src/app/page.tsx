import { Banner } from "@/components/sections/Banner";
import { Belief } from "@/components/sections/Belief";
import { Facts } from "@/components/sections/Facts";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Outcomes } from "@/components/sections/Outcomes";
import { Vision } from "@/components/sections/Vision";

export default function Home() {
  return (
    <>
      <Hero />
      <Belief />
      <Facts />
      <HowItWorks />
      <Banner />
      <Outcomes />
      <Vision />
    </>
  );
}
