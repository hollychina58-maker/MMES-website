import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Us - MMES-MCTI",
    description: "Learn about MMES-MCTI's mission, vision, and expertise in precision inertial navigation systems.",
    openGraph: {
      title: "About Us - MMES-MCTI",
      description: "Learn about MMES-MCTI's mission, vision, and expertise in precision inertial navigation systems.",
      type: "website",
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}