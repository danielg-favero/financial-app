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
import { Input } from "@/shared/components/ui/input";

import { signInMessages } from "@/modules/auth/features/signin/signin.messages";
import type { ISignInModel } from "@/modules/auth/features/signin/signin.model";

export function SignInView({
  form,
  onSubmit,
  isSubmitting,
}: Readonly<ISignInModel>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{signInMessages.title}</CardTitle>
        <CardDescription>{signInMessages.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{signInMessages.emailLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={signInMessages.emailPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{signInMessages.passwordLabel}</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="link"
              className="h-auto self-end p-0 text-sm"
              asChild
            >
              <Link href="/auth/forgot-password">
                {signInMessages.forgotPasswordLink}
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="mt-6 flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? signInMessages.submitting : signInMessages.submit}
            </Button>
            <p className="text-sm text-muted-foreground">
              {signInMessages.signUpPrompt}{" "}
              <Button variant="link" className="h-auto p-0" asChild>
                <Link href="/auth/signup">{signInMessages.signUpLink}</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
