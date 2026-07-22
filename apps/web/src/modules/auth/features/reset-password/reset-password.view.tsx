import { CircleX } from "lucide-react";
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
import { PasswordInput } from "@/shared/components/ui/password-input";

import { NewPasswordInput } from "@/modules/auth/components/new-password-input";
import { resetPasswordMessages } from "@/modules/auth/features/reset-password/reset-password.messages";
import type { IResetPasswordModel } from "@/modules/auth/features/reset-password/reset-password.model";

export function ResetPasswordView({
  hasCode,
  form,
  onSubmit,
  isSubmitting,
}: Readonly<IResetPasswordModel>) {
  if (!hasCode) {
    return (
      <Card>
        <CardHeader>
          <CircleX className="mb-2 size-10 text-destructive" aria-hidden="true" />
          <CardTitle className="text-2xl">{resetPasswordMessages.missingCodeTitle}</CardTitle>
          <CardDescription>{resetPasswordMessages.missingCodeDescription}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/auth/forgot-password">{resetPasswordMessages.requestNewLink}</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{resetPasswordMessages.title}</CardTitle>
        <CardDescription>{resetPasswordMessages.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{resetPasswordMessages.passwordLabel}</FormLabel>
                  <FormControl>
                    <NewPasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{resetPasswordMessages.confirmPasswordLabel}</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-6 flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? resetPasswordMessages.submitting : resetPasswordMessages.submit}
            </Button>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/auth/signin">{resetPasswordMessages.backToSignIn}</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
