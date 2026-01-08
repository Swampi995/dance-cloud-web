import { memo } from "react";
import { JSX } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import appImage1 from "@/assets/images/app_image_1.avif";
import appImage2 from "@/assets/images/app_image_2.avif";
import appImage3 from "@/assets/images/app_image_3.avif";
import AppStoreBlack from "@/assets/svg/app_store_black.svg?react";
import GooglePlay from "@/assets/svg/google_play.svg?react";
import Autoplay from "embla-carousel-autoplay";

const title = "The ultimate platform for dance schools and dancers";
const subtitle =
  "Empower dancers to stay connected, track progress, grow their skills and streamline dance school operations with powerful management tools, all in one place.";
const appStoreLink =
  "https://apps.apple.com/app/dance-cloud-all-in-one-app/id6474421119";
const googlePlayLink =
  "https://play.google.com/store/apps/details?id=smpath.dance.cloud";

const images = [
  { src: appImage1, alt: "App Image 1" },
  { src: appImage2, alt: "App Image 2" },
  { src: appImage3, alt: "App Image 3" },
];

const carouselPlugins = [Autoplay({ delay: 2000, stopOnFocusIn: false })];

const DesktopImages = memo(() => (
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
));

DesktopImages.displayName = "DesktopImages";

const MobileCarousel = memo(() => (
  <Carousel className="relative w-full flex-grow" plugins={carouselPlugins}>
    <CarouselContent className="h-full">
      {images.map((image, index) => (
        <CarouselItem
          key={index}
          className="flex h-full items-center justify-center"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="max-h-[calc(100vh-400px)] w-auto object-contain"
            loading="lazy"
          />
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
));

MobileCarousel.displayName = "MobileCarousel";

const LandingHero = (): JSX.Element => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="flex h-screen min-h-full w-full justify-center text-center">
      <div className="z-10 mt-[10vh] flex flex-col items-center gap-6">
        <h1 className="inline-block px-4 text-xl font-semibold tracking-tight drop-shadow-[0_0_25px_rgba(255,59,255,0.2)] md:text-2xl lg:text-3xl xl:text-4xl">
          {title}
        </h1>
        <h2 className="px-4 text-sm font-light tracking-wide text-neutral-300 drop-shadow-[0_0_25px_rgba(255,59,255,0.5)] md:w-2/3 md:text-base lg:text-lg xl:text-xl">
          {subtitle}
        </h2>
        <div className="flex items-center gap-4">
          <a href={appStoreLink}>
            <AppStoreBlack />
          </a>
          <a href={googlePlayLink}>
            <GooglePlay />
          </a>
        </div>
        {isDesktop ? <DesktopImages /> : <MobileCarousel />}
      </div>
      <div className="absolute bottom-0 h-full w-full bg-[url('@/assets/images/home_image.avif')] bg-cover bg-fixed bg-bottom bg-no-repeat" />
    </div>
  );
};

LandingHero.displayName = "LandingHero";

export default LandingHero;
