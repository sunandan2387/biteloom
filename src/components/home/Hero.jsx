import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/buttons';

const HeroScreenshot = () => {
  return (
    <div className="hidden lg:grid items-center justify-center mt-16 mx-8">
      <img
        src={'/static/images/home/byteloomSs.jpg'}
        alt="App screenshot"
        className="mx-auto h-[90%] lg:max-lg:w-[90%]  2xl:max-w-[72rem]"
        width={3840}
        height={75}
      />
    </div>
  );
};

export default function Hero() {
  return (
    <div className='flex flex-col mt-12 items-center justify-center w-full'>
      <section className="py-8 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className=" text-3xl md:text-7xl md:max-w-[54rem] ">
            ByteLoom<br></br> Accelerate your big data job execution
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Data intelligence platform with AI integration
          </p>
          <div className="space-x-4 mt-6">
            <a href="/auth/login" className={cn(buttonVariants({ size: 'lg' }))}>
              Get Started
            </a>
            <a
              href="/docs"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}
            >
              Learn More <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
      <HeroScreenshot />
    </div>
  );
}
