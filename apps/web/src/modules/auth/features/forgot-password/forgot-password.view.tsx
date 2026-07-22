import { MailCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

import { forgotPasswordMessages } from "@/modules/auth/features/forgot-password/forgot-password.messages";
import type { IForgotPasswordModel } from "@/modules/auth/features/forgot-password/forgot-password.model";

export function ForgotPasswordView({
  form,
  onSubmit,
  isSubmitting,
  isSubmitted,
}: Readonly<IForgotPasswordModel>) {
  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <MailCheck className="mb-2 size-10 text-primary" aria-hidden="true" />
          <CardTitle className="text-2xl">{forgotPasswordMessages.submittedTitle}</CardTitle>
          <CardDescription>{forgotPasswordMessages.submittedDescription}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/signin">{forgotPasswordMessages.backToSignIn}</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{forgotPasswordMessages.title}</CardTitle>
        <CardDescription>{forgotPasswordMessages.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{forgotPasswordMessages.emailLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={forgotPasswordMessages.emailPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-6 flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? forgotPasswordMessages.submitting
                : forgotPasswordMessages.submit}
            </Button>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/auth/signin">{forgotPasswordMessages.backToSignIn}</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
