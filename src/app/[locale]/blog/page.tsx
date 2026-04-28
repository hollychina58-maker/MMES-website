import type { Metadata } from "next";
import { BlogClient } from "./BlogClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog - MMES-MCTI",
    description: "Read the latest news and insights on inertial navigation, AHRS, IMU technology, and industrial sensor applications from MMES-MCTI.",
    openGraph: {
      title: "Blog - MMES-MCTI",
      description: "Read the latest news and insights on inertial navigation, AHRS, IMU technology, and industrial sensor applications from MMES-MCTI.",
      type: "website",
    },
  };
}

export default function BlogPage() {
  return <BlogClient />;
}