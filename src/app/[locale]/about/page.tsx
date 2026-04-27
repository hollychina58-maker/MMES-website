"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-medium text-blue-600 tracking-widest uppercase mb-6">About Us</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-[1.1]">{t("title")}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700"
        >
          {[
            { value: "15+", label: t("yearsExperience") },
            { value: "50+", label: t("countriesServed") },
            { value: "1000+", label: t("productsDelivered") },
          ].map((stat, index) => (
            <div key={index} className="text-center p-12 bg-white dark:bg-slate-900">
              <div className="text-5xl md:text-6xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16"
        >
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white tracking-tight">{t("ourMission")}</h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {t("missionText")}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white tracking-tight">{t("ourVision")}</h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {t("visionText")}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
