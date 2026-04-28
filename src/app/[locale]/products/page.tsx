import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ProductsClient = dynamic(() => import("./ProductsClient").then(mod => mod.ProductsClient), {
  loading: () => (
    <div className="min-h-screen py-24 flex items-center justify-center">
      <div className="animate-spin w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full" />
    </div>
  ),
  ssr: true,
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Products - MMES-MCTI",
    description: "Explore MMES-MCTI's precision inertial navigation products including AHRS, IMU, and gyroscopes for industrial applications.",
    openGraph: {
      title: "Products - MMES-MCTI",
      description: "Explore MMES-MCTI's precision inertial navigation products including AHRS, IMU, and gyroscopes for industrial applications.",
      type: "website",
    },
  };
}

export default function ProductsPage() {
  return <ProductsClient />;
}