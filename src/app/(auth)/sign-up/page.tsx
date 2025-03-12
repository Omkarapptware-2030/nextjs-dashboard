"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const isCheckingUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          console.log("response", response);

          setUsernameMessage(response.data.message);
        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            AxiosError.response?.data.message ?? ": Error in checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    isCheckingUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error in signing of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(`signup failed", ${errorMessage} ?? `);
    }
    setIsSubmitting(false);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        debounced(event.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"} `}
                  >
                    {usernameMessage}
                  </p>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white rounded-md px-4 py-2 w-full "
            >
              {isSubmitting ? (
                <div className="flex justify-center align-middle">
                  <Loader2 className="mr-2 w-4 animate-spin" /> Please Wait
                </div>
              ) : (
                "Signup"
              )}
            </button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            Already a member?
            <Link
              href={"/sign-in"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign-in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
