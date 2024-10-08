"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function NewsletterSignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the email to your API
    console.log(values);
  }

  return (
    <div className="container flex justify-center items-center -mb-[65px] z-[3] relative">
      <Card className="w-full mx-[100px] rounded-3xl border-none drop-shadow-md grow">
        <div className="p-6 flex justify-between gap-6 items-center">
          <div className="">
            <h4 className="text-2xl font-semibold text-black mb-3">
              Newsletter
            </h4>
            <p className="text-sm font-light text-gray-500">
              Have you signed up for our Newsletter yet? Sign up to receive
              exclusive information and product announcements.
            </p>
          </div>
          <div className="shrink-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex space-x-3 "
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input
                          className="font-light p-6 rounded-lg min-w-[299px]"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant={"primary"}
                  size={"lg"}
                  className="text-sm font-light p-6 rounded-lg"
                  type="submit"
                >
                  Sign Up
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}
