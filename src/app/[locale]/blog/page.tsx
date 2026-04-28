import type { Metadata } from "next";
import dynamic from "next/dynamic";

const BlogClient = dynamic(() => import("./BlogClient").then(mod => mod.BlogClient), {
  loading: () => (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  ),
  ssr: true,
});

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