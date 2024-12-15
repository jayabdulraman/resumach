// 'use client'
// /* eslint-disable lingui/text-restrictions */
// /* eslint-disable lingui/no-unlocalized-strings */

// import { Quotes } from "@phosphor-icons/react";
// import { cn } from "@/utils/cn";
// import { motion } from "framer-motion";

// const email = "info@ajalloh.com";

// type Testimonial = {
//   quote: string;
//   name: string;
// };

// const testimonials: Testimonial[][] = [
//   [
//     {
//       name: "Amanda Williams",
//       quote:
//         "This is really a thank you for JobFit. Drafting resumes was never a strength of mine, so your app really made the whole process easy and smooth!",
//     },
//     {
//       name: "James Clarfort",
//       quote:
//         "Hi! First off, many thanks for making JobFit! This is one of the best resume-building tools I have ever found. Have also recommended it to many of my university friends...",
//     },
//   ],
//   [
//     {
//       name: "Foday Kamara",
//       quote:
//         "Hey, Just wanted to let you know you not only helped me get a job, you helped my partner and my childhood friend, who then used your site to help one of her friends get a job. I wanted to let you know you really made a difference with your resume builder.",
//     },
//   ],
//   [
//     {
//       name: "Alice Kamara",
//       quote:
//         "Hey, I have loved your JobFit Website. Thank you so much for making this kind of thing.",
//     },
//     {
//       name: "Innocent Indobesie",
//       quote:
//         "First of all, I appreciate your effort for making a free tool for the community. Very much better than many premium resume builder...",
//     },
//   ],
// ];

// export function TestimonialsSection() {
//   return (
//   <section id="testimonials" className="container relative">
//     <div className="space-y-6 text-center">
//       <h2 className="text-3xl font-bold">{`Testimonials`}</h2>
//       <p className="mx-auto max-w-2xl text-gray-600 leading-relaxed">
//           I always love to hear from you with feedback or support. Here are
//           some of the messages I've received. If you have any feedback, feel free to drop me an
//           email at{" "}
//           <a href={email} className="underline">
//             {email}
//           </a>
//           .
//       </p>
//     </div>

//     <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-y-0">
//       {testimonials.map((columnGroup, groupIndex) => (
//         <div key={groupIndex} className="space-y-8">
//           {columnGroup.map((testimonial, index) => (
//             <motion.figure
//               key={index}
//               initial={{ opacity: 0, y: -100 }}
//               animate={{ opacity: 1, y: 0, transition: { delay: index * 0.25 } }}
//               className={cn(
//                 "relative overflow-hidden rounded-lg bg-secondary-accent p-5 text-gray-600 shadow-lg",
//                 index > 0 && "hidden lg:block",
//               )}
//             >
//               <Quotes size={64} className="absolute -right-3 bottom-0 opacity-20" />
//               <blockquote className="italic leading-relaxed">
//                 &ldquo;{testimonial.quote}&rdquo;
//               </blockquote>
//               <figcaption className="mt-3 font-medium">{testimonial.name}</figcaption>
//             </motion.figure>
//           ))}
//         </div>
//       ))}
//     </div>
//   </section>
// )};
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  name: string;
  comment: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Amanda Williams",
    comment: "This is really a thank you for JobFit. Drafting resumes was never a strength of mine, so your app really made the whole process easy and smooth!",
    image: "/api/placeholder/100/100"
  },
  {
    name: "James Clarfort",
    comment: "Hi! First off, many thanks for making JobFit! This is one of the best resume-building tools I have ever found. Have also recommended it to many of my university friends...",
    image: "/api/placeholder/100/100"
  },
  {
    name: "Foday Kamara",
    comment: "Hey, Just wanted to let you know you not only helped me get a job, you helped my partner and my childhood friend, who then used your site to help one of her friends get a job. I wanted to let you know you really made a difference with your resume builder.",
    image: "/api/placeholder/100/100"
  },
  {
    name: "Alice Mandrega",
    comment: "Hey, I have loved your JobFit Website. Thank you so much for making this kind of thing.",
    image: "/api/placeholder/100/100"
  },
  {
    name: "Innocent Ndobesie",
    comment: "First of all, I appreciate your effort for making a free tool for the community. Very much better than many premium resume builder...",
    image: "/api/placeholder/100/100"
  }
];

const email = "info@ajalloh.com";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % testimonials.length
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <div className="space-y-6 text-center mb-4">
          <h2 className="text-3xl font-bold">{`Testimonials`}</h2>
          <p className="mx-auto max-w-2xl text-gray-600 leading-relaxed">
              I always love to hear from you with feedback or support. Here are
              some of the messages I've received. If you have any feedback, feel free to drop me an
              email at{" "}
              <a href={email} className="underline">
                {email}
              </a>
              .
          </p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <Card className="w-full max-w-2xl p-8 shadow-xl">
              <CardContent>
                <Quote className="mx-auto mb-4 text-purple-700 dark:text-white w-6 h-6"/>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-400 mb-6 italic leading-relaxed">
                  "{testimonials[currentIndex].comment}"
                </p>
                <div className="flex items-center justify-center">
                  <h3 className="text-lg font-semibold text-purple-700 dark:text-white">
                    {testimonials[currentIndex].name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={handlePrev} 
          className="absolute left-[-5px] top-2/3 transform -translate-y-1/2 
                     bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600"/>
        </button>
        <button 
          onClick={handleNext} 
          className="absolute right-[-5px] top-2/3 transform -translate-y-1/2 
                     bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
        >
          <ChevronRight className="w-6 h-6 text-gray-600"/>
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
