import { CloudCog, Camera, Clock2, Code2, DownloadCloudIcon, GitFork } from 'lucide-react';

const FeatureCard = ({ heading, description, icon }) => {
  return (
    <div className="rounded-lg border bg-background-light dark:bg-background-dark p-2">
      <div className="flex h-[180px] flex-col justify-between p-6">
        <div className="space-y-2">
          {icon}
          <h3 className="font-bold">{heading}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function FeatureList() {
  return (
    <section className="space-y-6  py-8 mx-4">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl leading-4 md:text-6xl">Features</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground text-lg">
          ByteLoom provides many features to help you accelerate your big data job execution.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        <FeatureCard
          heading={'Add Github Repository URL'}
          description={'Branch URL, directory url, sub path, and file path.'}
          icon={<CloudCog size={32} />}
        />
        <FeatureCard
          heading={'Create your workspaces'}
          description={'Personal directories to save previous spark jobs'}
          icon={<Camera size={32} />}
        />
        <FeatureCard
          heading={'Cron Jobs'}
          description={'Schedule cron jobs'}
          icon={<Clock2 size={32} />}
        />
        <FeatureCard
          heading={'Add Github Repository URL'}
          description={'Branch URL, directory url, sub path, and file path.'}
          icon={<Code2 size={32} />}
        />
        <FeatureCard
          heading={'Extract data'}
          description={'Run heavy jobs over large datasets'}
          icon={<DownloadCloudIcon size={32} />}
        />
        <FeatureCard
          heading={'Git Clone'}
          description={'Create a new workspace from a git repository'}
          icon={<GitFork size={32} />}
        />
      </div>
      <div className="mx-auto text-center md:max-w-[58rem]">
        <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Datasage creates a user friendly UI for executing spark jobs on Azure. It is a web
          application that allows users to run spark jobs on Azure. 
        </p>
      </div>
    </section>
  );
}
