import { Button } from "@/components/ui/button";
import { JSX } from "react";
import { useNavigate } from "react-router";

const NotFound = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 py-20">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Button variant="outline" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );
};

NotFound.displayName = "NotFound";

export { NotFound };
