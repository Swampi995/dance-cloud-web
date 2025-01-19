import { JSX } from "react";

const LandingHero = (): JSX.Element => {
  return (
    <div className="fixed flex min-h-full w-full justify-center">
      <div className="z-10 mt-[15vh] flex flex-col items-center gap-6 px-4 md:mt-[20vh]">
        Landing Hero
      </div>
    </div>
  );
};

export { LandingHero };
