import { Button } from "@/components/ui/button";
import { JSX } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const title = "The ultimate platform for dance schools and dancers",
  subtitle =
    "Empower dancers to stay connected, track progress, grow their skills and streamline dance school operations with powerful management tools, all in one place.",
  buttonLink = `smpath.dance.cloud://dancecloud`;

const images = [
  { src: "src/assets/images/app_image_1.avif", alt: "App Image 1" },
  { src: "src/assets/images/app_image_2.avif", alt: "App Image 2" },
  { src: "src/assets/images/app_image_3.avif", alt: "App Image 3" },
];

const LandingHero = (): JSX.Element => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const DesktopImages = () => (
    <div className="flex items-center justify-center gap-4 overflow-hidden p-12">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className={`object-fit h-full ${index !== 1 ? "scale-90" : ""} drop-shadow-[0_0_25px_rgba(255,59,255,0.2)]`}
          loading="lazy"
        />
      ))}
    </div>
  );

  const MobileCarousel = () => (
    <Carousel className="w-full max-w-xs px-12">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <img
              src={image.src}
              alt={image.alt}
              className="h-auto w-full"
              loading="lazy"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );

  return (
    <div className="flex h-screen min-h-full w-full justify-center text-center">
      <div className="z-10 mt-[10vh] flex flex-col items-center gap-6">
        <h1 className="inline-block text-xl font-semibold tracking-tighter drop-shadow-[0_0_25px_rgba(255,59,255,0.2)] md:text-2xl lg:text-3xl xl:text-4xl">
          {title}
        </h1>
        <h2 className="w-2/3 text-sm font-light tracking-wide text-neutral-400 drop-shadow-[0_0_25px_rgba(255,59,255,0.5)] md:text-base lg:w-1/2 lg:text-lg xl:text-xl">
          {subtitle}
        </h2>
        <Button
          asChild
          variant={"outline"}
          size={"xl"}
          className="relative cursor-pointer border-0 bg-transparent py-4 font-semibold tracking-tight shadow-[0_0_15px_rgba(255,59,255,0.5)] transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-[linear-gradient(to_right,#FF3BFF,#ECBFBF,#5C24FF,#D94FD5)] before:p-[1px] after:absolute after:inset-[1px] after:-z-10 after:rounded-lg after:bg-background hover:scale-105 hover:shadow-[0_0_20px_rgba(255,59,255,0.7)] md:text-lg lg:py-5 lg:text-xl xl:py-7 xl:text-2xl"
        >
          <a href={buttonLink}>Open App</a>
        </Button>
        {isDesktop ? <DesktopImages /> : <MobileCarousel />}
      </div>
      <div className="absolute bottom-0 h-full w-full bg-[url('@/assets/images/home_image.avif')] bg-cover bg-bottom bg-no-repeat" />
    </div>
  );
};

export { LandingHero };
