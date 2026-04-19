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
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8">{t("title")}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { value: "15+", label: t("yearsExperience") },
            { value: "50+", label: t("countriesServed") },
            { value: "1000+", label: t("productsDelivered") },
          ].map((stat, index) => (
            <div key={index} className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4">{t("ourMission")}</h2>
            <p className="text-slate-600 dark:text-slate-400">
              {t("missionText")}
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4">{t("ourVision")}</h2>
            <p className="text-slate-600 dark:text-slate-400">
              {t("visionText")}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
