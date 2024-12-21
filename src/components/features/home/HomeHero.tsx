import { Separator } from "@/components/ui/separator";
import AppStoreWhite from "@/assets/svg/AppStoreWhite.svg?react";

const homeTitle = "Dance Cloud",
  homeSubtitle = "Oops! Something went offbeat!",
  homeDescription =
    "You've arrived at the dance floor, but the app couldn't open directly from here. No worries, just tap the button below to hit the dance floor and join the fun!";

const HomeHero = () => {
  return (
    <div>
      <h1 className="text-9xl tracking-tighter">{homeTitle}</h1>
      <h2 className="text-4xl tracking-tighter">{homeSubtitle}</h2>
      <h3 className="text-2xl tracking-tighter">{homeDescription}</h3>
      <Separator />
      <AppStoreWhite />
    </div>
  );
};

export { HomeHero };
