import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { JSX, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import EyeOpen from "@/assets/svg/eye_open.svg?react";
import EyeClosed from "@/assets/svg/eye_closed.svg?react";
import FacebookLogo from "@/assets/svg/facebook_logo.svg?react";
import GoogleLogo from "@/assets/svg/google_logo.svg?react";
import AppleLogo from "@/assets/svg/apple_logo.svg?react";
import { Separator } from "@/components/ui/separator";

const title = "Step Up to Dance Cloud!",
  subtitle = "Where every beat uplifts your spirit";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const Login = (): JSX.Element => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="flex h-screen min-h-full w-full justify-center text-center">
      <div className="z-10 mt-[20vh] flex flex-col items-center gap-6">
        <h1 className="mx-4 inline-block text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl xl:text-5xl">
          {title}
        </h1>
        <h2 className="mx-4 mb-4 text-sm tracking-wide text-neutral-300 md:text-base lg:text-lg xl:text-xl">
          {subtitle}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormControl>
                    <Input
                      className="rounded-b-none border-b-[0.25px] ring-inset"
                      placeholder="user@dancecloud.com"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="rounded-t-none border-t-[0.25px] ring-inset"
                        placeholder="••••••••••••"
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeClosed
                            width={16}
                            className="hover:text-muted-foreground"
                          />
                        ) : (
                          <EyeOpen
                            width={16}
                            className="hover:text-muted-foreground"
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="my-4 flex items-center">
              <FormDescription>You don't have an account yet?</FormDescription>
              <Button variant="link" size="sm" className="px-1 py-0">
                <a href="/signup">Sign Up</a>
              </Button>
              <FormDescription>here</FormDescription>
            </div>
            <Button type="submit" className="w-full">
              Log In
            </Button>
            <div className="relative my-4 w-full">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>
            <div className="flex w-full justify-around">
              <a href="/" className="rounded-sm bg-white p-2">
                <AppleLogo />
              </a>
              <a href="/" className="rounded-sm bg-white p-2">
                <GoogleLogo />
              </a>
              <a href="/" className="rounded-sm bg-white p-2">
                <FacebookLogo />
              </a>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export { Login };
