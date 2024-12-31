import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  name: string;
  comment: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Amanda Williams",
    comment: "This is really a thank you for resumach. Tailoring resumes took too much time, so your app really made the whole process easy and smooth!",
  },
  {
    name: "James Clarfort",
    comment: "Hi! First off, many thanks for making resumach! I used to spend hours tailoring my resumes on specific jobs. I didn't know you can do it in seconds thanks to resumach. Have also recommended it to many of my friends...",
  },
  {
    name: "Foday Kamara",
    comment: "Hey, Just wanted to let you know that I was able to get an interview by submitting the resume your tool customized for me. I also wanted to let you know you really made a difference with your resume tailoring tool.",
  },
  {
    name: "Alice Mandrega",
    comment: "Hey, I have loved your resumach Website. Thank you so much for making this kind of thing.",
  },
  {
    name: "Innocent Ndobesie",
    comment: "Wow, the level of details and accuracy is spot on. Very much better than many premium resume builders...",
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
              I always love to hear from you with feedback or support. If you have any, feel free to drop me an
              email at{" "}
              <a href={email} className="text-purple-600 underline">
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
