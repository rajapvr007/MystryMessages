"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/Schema/signInSchema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

// ! page start from here!
const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: true,
      identifier: data.identifier,
      password: data.password,
      callbackUrl: "/dashboard",
    });

    //todo remove in the production
    console.log("result of the sign in page", result);
    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed!",
          description: "Incorrect username or password!",
          variant: "destructive",
        });
      }
    }

    // if (result?.url) {
    //   //todo remove
    //   console.log("i am in login page");
    //   router.replace("/dashboard");
    //   console.log("i am in login page");
    // }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystery Message
            </h1>
            <p className="mb-4">
              Sign in to continue your secret conversations
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/username</FormLabel>
                    <FormControl>
                      <Input type="identifier" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Signin</Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              are you a member?
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
