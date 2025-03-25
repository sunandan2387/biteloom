import React from "react";
import { Lock, CloudIcon } from "lucide-react";
import Image from "next/image";


const features = [
  {
    name: "Cloud based security",
    description:
      "Your credentials are saved in the most secure way, and your data is encrypted.",
    icon: CloudIcon,
  },
  {
    name: "Secure deployment",
    description:
      "Deploy your spark jobs in the most secure way.",
    icon: Lock,
  },
];

const FeatureText = ({ isFlipped }) => {
  return (
    <div className={`px-6 lg:px-0 lg:pr-4 lg:pt-4 ${isFlipped ? "lg:ml-8 order-2" : ""}`}>
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
        <h2 className="font-semibold leading-7 text-slate-500">Deploy faster</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Create your workspace</p>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Create a new workspace, after adding your Azure credentials and deploy your spark jobs with a single click in the most 
          secure way.
        </p>
        <div className="mt-10 max-w-xl space-y-8 text-base leading-7 text-slate-600 lg:max-w-none">
          {features.map((feature) => (
            <div key={feature.name} className="">
              <div className="flex items-center">
                {React.createElement(feature.icon, { className: "mr-2 mb-1", size: 24 })}
                <span className="font-semibold text-lg">{feature.name}</span>
              </div>
              <div className="text-slate-400 text-base font-medium">{feature.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureImage = () => {
  return (
    <div className="hidden lg:block self-center">
      <Image src={'/static/images/home/step1.jpg'} alt="Product screenshot" width={3840} height={75} />
    </div>
  );
};

export default function Feature({ isFlipped }) {
  return (
    <div className="mt-24">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
          <FeatureText isFlipped={isFlipped} />
          <FeatureImage />
        </div>
      </div>
    </div>
  );
}
