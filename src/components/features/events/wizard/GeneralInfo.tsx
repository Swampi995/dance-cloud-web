import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon } from "lucide-react";
import { GeneralInfoFormValues } from "./schemas/generalInfo.schema";

type GeneralInfoProps = {
  form: UseFormReturn<GeneralInfoFormValues>;
  className?: string;
};

const GeneralInfo: FC<GeneralInfoProps> = memo(({ form, className }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const images = form.watch("images");

  useEffect(() => {
    if (!images || images.length === 0) {
      setPreviews([]);
      return;
    }
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const acceptImageFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const accepted = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (accepted.length === 0) return;
      const next = [...(form.getValues("images") ?? []), ...accepted];
      form.setValue("images", next, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      acceptImageFiles(e.dataTransfer?.files ?? null);
    },
    [acceptImageFiles],
  );

  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging],
  );

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleSelectClick = useCallback(
    () => fileInputRef.current?.click(),
    [],
  );
  const hasPreviews = useMemo(() => previews.length > 0, [previews]);

  return (
    <Form {...form}>
      {/* Full width on small; constrained on md+ */}
      <div
        className={cn("mx-auto w-full md:max-w-3xl lg:max-w-4xl", className)}
      >
        <div className="space-y-6">
          {/* 1) Upload Box */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormControl>
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectClick();
                      }
                    }}
                    onClick={handleSelectClick}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    className={`flex flex-col items-center justify-center rounded-md border border-dashed p-6 text-center transition ${isDragging ? "border-primary/70 bg-primary/5" : "border-muted-foreground/30 hover:bg-muted/30"}`}
                  >
                    <ImageIcon
                      className="mb-2 h-10 w-10 opacity-70"
                      aria-hidden
                    />
                    <div className="text-sm font-medium">
                      Choose an image for your event
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Drag & drop here, or click to browse
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => acceptImageFiles(e.target.files)}
                    />
                  </div>
                </FormControl>
                {hasPreviews && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {previews.map((src, idx) => (
                      <img
                        key={src + idx}
                        src={src}
                        alt={`Selected preview ${idx + 1}`}
                        className="h-20 w-20 shrink-0 rounded object-cover ring-1 ring-border"
                      />
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 2) Title / Subtitle row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="add event title"
                      maxLength={20}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="add event subtitle"
                      maxLength={30}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 3) Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a suggestive description of your event"
                    className="min-h-[120px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 4) Max participants / Show toggle row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What is the maximum number of participants?
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="add maximum participants"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v === "" ? undefined : Number(v));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <FormLabel htmlFor="isVisible" className="m-0">
                        Show the event
                      </FormLabel>
                      <Switch
                        id="isVisible"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    check to display the event to users/uncheck to hide the
                    event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </Form>
  );
});

GeneralInfo.displayName = "GeneralInfo";

export { GeneralInfo };
