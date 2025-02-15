import Progress from "@/assets/svg/progress.svg?react";

const Loading = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <Progress className="h-8 w-8 animate-spin" />
  </div>
);

Loading.displayName = "Loading";

export { Loading };
