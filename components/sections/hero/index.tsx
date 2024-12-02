'use client'
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

// import { defaultTiltProps } from "@/client/constants/parallax-tilt";

import { HeroCTA } from "./call-to-action";
import { Decoration } from "./decoration";

interface HeroProps {
  userId: string;
}

export function HeroSection ({userId}: HeroProps) {
  return (
  <section id="hero" className="relative">
    <Decoration.Grid />
    <Decoration.Gradient />

    <div className="mx-auto max-w-7xl lg:flex h-auto lg:items-center">
      <motion.div
        className="mx-auto mt-32 max-w-3xl shrink-0 lg:mx-0 lg:mt-0 lg:max-w-xl"
        viewport={{ once: true }}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="space-y-2">
          <h6 className="text-base font-bold tracking-wide">{`Finally,`}</h6>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {`Customize Your Resume with AI`}
          </h1>
        </div>

        <p className="prose prose-base prose-zinc mt-6 text-lg leading-8 dark:prose-invert">
          {`JobFit uses AI to tailor your resume to specific job descriptions, increasing your chances of landing an interview.`}
        </p>

        <div className="mt-10 flex items-center gap-x-8">
          <HeroCTA userId={userId} />
        </div>
      </motion.div>

      <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-20">
        <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
          <motion.div
            viewport={{ once: true }}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Tilt>
              <img
                width={3600}
                height={2078}
                src="/screenshots/builder.jpg"
                alt="JobFit - Screenshot - Builder Screen"
                className="w-[76rem] rounded-lg bg-background/5 shadow-2xl ring-1 ring-foreground/10"
              />
            </Tilt>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
  )
};
