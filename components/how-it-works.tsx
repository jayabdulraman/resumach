import React from 'react';
import { Card } from "@/components/ui/card";
import { FileText, Layout, Download } from "lucide-react";

// SVG Components remain the same
const AIDocumentVector = () => (
  <svg className="w-80 h-80" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="20" width="240" height="200" rx="10" fill="#E9D5FF" />
    <rect x="80" y="50" width="180" height="20" rx="4" fill="#9333EA" fillOpacity="0.3" />
    <rect x="80" y="90" width="140" height="20" rx="4" fill="#9333EA" fillOpacity="0.3" />
    <rect x="80" y="130" width="160" height="20" rx="4" fill="#9333EA" fillOpacity="0.3" />
    <rect x="80" y="170" width="120" height="20" rx="4" fill="#9333EA" fillOpacity="0.3" />
    <circle cx="320" cy="100" r="30" fill="#9333EA" fillOpacity="0.2" />
    <path d="M310 100 L330 100 M320 90 L320 110" stroke="#9333EA" strokeWidth="4" />
  </svg>
);

const GirlLaptopVector = () => (
  <svg className="w-80 h-80" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="100" y="80" width="200" height="120" rx="10" fill="#E9D5FF" />
    <rect x="80" y="200" width="240" height="20" rx="5" fill="#9333EA" fillOpacity="0.3" />
    <path d="M150 150 C150 100 250 100 250 150" stroke="#9333EA" strokeWidth="4" />
    <rect x="140" y="120" width="120" height="80" rx="5" fill="#9333EA" fillOpacity="0.2" />
  </svg>
);

const StepsExplanation = () => {
  const steps = [
    {
      number: "1",
      title: "Upload your resume",
      description: "Upload your comprehensive resume. You can reuse your resume, easily skipping step one.",
      icon: FileText,
      bgColor: "bg-white"
    },
    {
      number: "2",
      title: "Add the job description",
      description: "Copy and paste the job description and hit generate. resumach AI will do the rest by comprehensively tailoring your resume to the job description.",
      icon: Layout,
      bgColor: "bg-purple-50"
    },
    {
      number: "3",
      title: "Click Download",
      description: "Choose from our ATS-friendly resume templates. Get your perfectly formatted document instantly with just one click.",
      icon: Download,
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 relative overflow-hidden">
      {/* Title */}
      <h2 className="text-4xl font-bold text-center mb-16">
        Tailor your resume in{" "}
        <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          3 easy steps
        </span>{" "}
        now with AI
      </h2>

      {/* Illustration - Top Right */}
      <div className="absolute top-0 right-0 -z-10 opacity-80">
        <AIDocumentVector />
      </div>

      {/* Illustration - Bottom Left */}
      <div className="absolute bottom-0 left-0 -z-10 opacity-80">
        <GirlLaptopVector />
      </div>

      {/* Steps Container with true staircase effect */}
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="relative space-y-6">
          {/* Step containers with absolute positioning for staircase effect style={{ height: '430px' }} */}
          <div className="relative w-full h-64 md:h-96">
            {/* Step 1 - Outermost */}
            <div className="absolute top-0 left-0 w-full">
              <Card className={`${steps[0].bgColor} dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-all duration-200`}>
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <span className="text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-400 bg-clip-text text-transparent">
                        1
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{steps[0].title}</h3>
                      <p className="hidden md:block text-gray-500">{steps[0].description}</p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Step 2 - Middle */}
            <div className="absolute top-24 md:top-36 left-4 right-[-4px] w-full">
              <Card className={`${steps[1].bgColor} dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-all duration-200`}>
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <span className="text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-400 bg-clip-text text-transparent">
                        2
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{steps[1].title}</h3>
                      <p className="hidden md:block text-gray-500">{steps[1].description}</p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      <Layout className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Step 3 - Innermost */}
            <div className="absolute top-44 md:top-72 left-8 right-[-8] w-full">
              <Card className={`${steps[2].bgColor} dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-all duration-200`}>
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <span className="text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-400 bg-clip-text text-transparent">
                        3
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{steps[2].title}</h3>
                      <p className="hidden md:block text-gray-500">{steps[2].description}</p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      <Download className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12 text-center">
        <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
          Build with AI
        </button>
      </div>
    </div>
  );
};

export default StepsExplanation;