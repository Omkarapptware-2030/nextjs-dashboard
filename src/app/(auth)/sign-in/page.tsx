"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      toast.error(`Incorrect password or email, ${result.error}`);
    }

    if (result?.url) {
      router.replace("/");
    }
    console.log("result", result);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Mystry Message
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className=" relative flex space-x-4">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="pr-10 "
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-[2%] top-[32%]"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  </div>

                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white rounded-md px-4 py-2 w-full"
            >
              {isSubmitting ? (
                <div className="flex justify-center align-middle">
                  <Loader2 className="mr-2 w-4 animate-spin" /> Please Wait
                </div>
              ) : (
                "Signin"
              )}
            </button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            Not Sign-up yet?
            <Link
              href={"/sign-up"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign-Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
