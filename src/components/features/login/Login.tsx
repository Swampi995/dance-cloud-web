import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
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
import User from "@/assets/svg/user.svg?react";
import LockClosed from "@/assets/svg/lock_closed.svg?react";
import { useAuth } from "@/lib/auth-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const title = "Step Up to Dance Cloud!",
  subtitle = "Where every beat uplifts your spirit";

const formSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty(),
});

const Login = (): JSX.Element => {
  const { user } = useAuth();
  console.log(user);
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      login(values.email, values.password);
    } catch (error) {
      console.error(error);
    }
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
              render={({ field, fieldState: { error } }) => (
                <FormItem
                  className={`relative focus-within:z-20 ${error && "z-10"}`}
                >
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <User width={16} className="text-muted-foreground" />
                      </div>
                      <Input
                        className={`mb-[-1px] rounded-b-none border-0 pl-8 ring-1 ring-inset ${
                          error ? "ring-red-500" : "ring-muted"
                        }`}
                        autoCapitalize="off"
                        placeholder="user@dancecloud.com"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <FormItem
                  className={`relative focus-within:z-20 ${error && "z-10"}`}
                >
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <LockClosed
                          width={16}
                          className="text-muted-foreground"
                        />
                      </div>
                      <Input
                        className={`rounded-t-none border-0 pl-8 ring-1 ring-inset ${
                          error ? "ring-red-500" : "ring-muted"
                        }`}
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
