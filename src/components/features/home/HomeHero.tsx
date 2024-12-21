import { Button } from "@/components/ui/button";

const homeTitle = "Dance Cloud",
  homeSubtitle = "Oops! Something went offbeat!",
  homeDescription =
    "You've arrived at the dance floor, but the app couldn't open directly from here. No worries, just tap the button below to hit the dance floor and join the fun!";

const HomeHero = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
      <div className="z-10 flex flex-col items-center gap-6 p-4">
        <h1 className="inline-block bg-[linear-gradient(to_right,#FF3BFF,#ECBFBF,#5C24FF,#D94FD5)] bg-clip-text text-5xl font-semibold tracking-tighter text-transparent sm:text-6xl md:text-8xl lg:text-9xl">
          {homeTitle}
        </h1>
        <h2 className="animate-[float_2s_linear_infinite] text-xl font-medium tracking-wide sm:text-2xl md:text-4xl">
          {homeSubtitle}
        </h2>
        <h3 className="max-w-3xl text-center text-lg font-normal tracking-wider text-neutral-200 sm:text-xl md:text-2xl">
          {homeDescription}
        </h3>
        <Button
          variant={"outline"}
          size={"xl"}
          className="after:bg-background relative cursor-pointer border-0 bg-transparent font-semibold tracking-tight shadow-[0_0_15px_rgba(255,59,255,0.5)] transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-[linear-gradient(to_right,#FF3BFF,#ECBFBF,#5C24FF,#D94FD5)] before:p-[1px] after:absolute after:inset-[1px] after:-z-10 after:rounded-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(255,59,255,0.7)] md:py-4 md:text-lg lg:py-5 lg:text-xl xl:py-7 xl:text-2xl"
        >
          Open app
        </Button>
      </div>
      <div className="absolute bottom-0 h-[40vh] w-full bg-gradient-to-b bg-[url('@/assets/images/hero_image.png')] from-transparent to-black bg-cover bg-bottom bg-no-repeat opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
    </div>
  );
};

export { HomeHero };
