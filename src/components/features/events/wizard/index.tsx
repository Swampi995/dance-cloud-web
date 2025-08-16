import { FC, memo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router";

import { Header } from "./Header";
import WizardNavigation from "./WizardNavigation";
import {
  GeneralInfoFormValues,
  generalInfoSchema,
} from "./schemas/generalInfo.schema";
import { GeneralInfo } from "./GeneralInfo";

type RouteParams = { id?: string };

const EventWizard: FC = () => {
  const [step, setStep] = useState(0);

  const { id } = useParams<RouteParams>();
  const isEditing = Boolean(id);
  const headerTitle = isEditing ? "Editing Event" : "Create Event";

  const form = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      images: [],
      title: "",
      subtitle: "",
      description: "",
      maxParticipants: undefined,
      isVisible: true,
    },
    mode: "onTouched",
  });

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden px-4 sm:px-10">
      <Header title={headerTitle} />

      <div className="flex-1 px-4">
        <div className="mx-auto w-full md:max-w-3xl lg:max-w-4xl">
          <WizardNavigation currentStep={step} onStepChange={setStep} />

          <div className="mt-6">
            {step === 0 && <GeneralInfo form={form} />}
            {step === 1 && (
              <div className="text-sm text-muted-foreground">
                Next step content goes here…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

EventWizard.displayName = "EventWizard";

export default memo(EventWizard);
