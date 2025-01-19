import { Button } from "@/components/ui/button";

const title = "Dance Cloud",
  subtitle = "Oops! Something went offbeat!",
  description =
    "You've arrived at the dance floor, but the app couldn't open directly from here. No worries, just tap the button below to hit the dance floor and join the fun!";
const buttonLink = `smpath.dance.cloud://dancecloud`;

const LaunchApp = () => {
  return (
    <div className="fixed flex min-h-full w-full justify-center">
      <div className="z-10 mt-[15vh] flex flex-col items-center gap-6 md:mt-[20vh]">
        <h1 className="inline-block bg-[linear-gradient(to_right,#FF3BFF,#ECBFBF,#5C24FF,#D94FD5)] bg-clip-text px-4 text-5xl font-semibold tracking-tighter text-transparent drop-shadow-[0_0_25px_rgba(255,59,255,0.2)] sm:text-6xl md:text-8xl lg:text-9xl">
          {title}
        </h1>
        <h2 className="animate-[float_2s_linear_infinite] px-4 text-xl font-medium tracking-wide drop-shadow-[0_0_25px_rgba(255,59,255,0.5)] sm:text-2xl md:text-4xl">
          {subtitle}
        </h2>
        <h3 className="max-w-3xl px-4 text-center text-lg font-normal tracking-wider text-neutral-200 drop-shadow-[0_0_25px_rgba(255,59,255,0.8)] sm:text-xl md:text-2xl">
          {description}
        </h3>
        <Button
          asChild
          variant={"outline"}
          size={"xl"}
          className="relative cursor-pointer border-0 bg-transparent font-semibold tracking-tight shadow-[0_0_15px_rgba(255,59,255,0.5)] transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-[linear-gradient(to_right,#FF3BFF,#ECBFBF,#5C24FF,#D94FD5)] before:p-[1px] after:absolute after:inset-[1px] after:-z-10 after:rounded-lg after:bg-background hover:scale-105 hover:shadow-[0_0_20px_rgba(255,59,255,0.7)] md:py-4 md:text-lg lg:py-5 lg:text-xl xl:py-7 xl:text-2xl"
        >
          <a href={buttonLink}>Open App</a>
        </Button>
      </div>
      <div className="absolute bottom-0 h-full w-full bg-[url('@/assets/images/hero_image.avif')] bg-cover bg-bottom bg-no-repeat opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
    </div>
  );
};

export { LaunchApp };
