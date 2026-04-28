import type { Metadata } from "next";
import { ProductsClient } from "./ProductsClient";

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