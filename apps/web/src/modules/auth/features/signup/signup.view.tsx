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
import { PasswordInput } from "@/shared/components/ui/password-input";

import { NewPasswordInput } from "@/modules/auth/components/new-password-input";
import { signUpMessages } from "@/modules/auth/features/signup/signup.messages";
import type { ISignUpModel } from "@/modules/auth/features/signup/signup.model";

export function SignUpView({ form, onSubmit, isSubmitting }: Readonly<ISignUpModel>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{signUpMessages.title}</CardTitle>
        <CardDescription>{signUpMessages.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{signUpMessages.firstNameLabel}</FormLabel>
                    <FormControl>
                      <Input autoComplete="given-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{signUpMessages.lastNameLabel}</FormLabel>
                    <FormControl>
                      <Input autoComplete="family-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{signUpMessages.emailLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={signUpMessages.emailPlaceholder}
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
                  <FormLabel>{signUpMessages.passwordLabel}</FormLabel>
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
                  <FormLabel>{signUpMessages.confirmPasswordLabel}</FormLabel>
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
              {isSubmitting ? signUpMessages.submitting : signUpMessages.submit}
            </Button>
            <p className="text-sm text-muted-foreground">
              {signUpMessages.signInPrompt}{" "}
              <Button variant="link" className="h-auto p-0" asChild>
                <Link href="/auth/signin">{signUpMessages.signInLink}</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
