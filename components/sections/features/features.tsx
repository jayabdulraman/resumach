import React from 'react';
import { Clock, FileText, Layout, UserCheck, Search, Share } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@phosphor-icons/react/dist/lib/types';

interface FeatureProps {
    icon: Icon;
    title: string;
    description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureProps) => (
  <Card className="bg-white dark:bg-slate-900 border-none shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="pt-6">
      <div className="rounded-lg bg-purple-50 dark:bg-black w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-purple-600" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: Clock,
      title: "Save valuable time",
      description: "Tailor your resume in just under 5 seconds with pre-formatted sections and templates to choose from, letting you increase your number of applications."
    },
    {
      icon: FileText,
      title: "AI-Powered Customization",
      description: "resumach AI analyzes job descriptions and optimizes your resume accordingly, increasing your chances of landing an interview."
    },
    {
      icon: Layout,
      title: "Extensive template options",
      description: "Choose from our vast collection of modern and traditional templates for resumes and CVs to match your professional style."
    },
    {
      icon: Share,
      title: "Share resume with recruiters",
      description: "Quickly generate and share your tailored resume with recruiters, mentors, or anyone."
    },
    {
      icon: UserCheck,
      title: "HR-approved templates",
      description: "Our templates and guidance are developed and endorsed by HR professionals and hiring CEOs, giving you the best chance of success."
    },
    {
      icon: Search,
      title: "ATS-friendly design",
      description: "All our templates are optimized for Applicant Tracking Systems, ensuring your resume gets past automated screenings."
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Features</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Discover why our resumach AI is the preferred choice for {" "}
          <span className='text-purple-600'>quickly</span> {" "} tailoring your resume with {" "}<span className='text-purple-600'>quality</span>.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;