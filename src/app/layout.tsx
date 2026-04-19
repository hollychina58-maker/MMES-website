import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMES-MCTI - Precision Inertial Navigation Systems",
  description: "Advanced AHRS, IMU, and Gyroscope Solutions for Industrial Applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
