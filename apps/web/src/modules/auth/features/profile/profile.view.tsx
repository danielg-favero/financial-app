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

import { profileMessages } from "@/modules/auth/features/profile/profile.messages";
import type { IProfileModel } from "@/modules/auth/features/profile/profile.model";

export function ProfileView({
  form,
  onSubmit,
  isSubmitting,
}: Readonly<IProfileModel>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{profileMessages.title}</CardTitle>
        <CardDescription>{profileMessages.description}</CardDescription>
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
                    <FormLabel>{profileMessages.firstNameLabel}</FormLabel>
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
                    <FormLabel>{profileMessages.lastNameLabel}</FormLabel>
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
                  <FormLabel>{profileMessages.emailLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={profileMessages.emailPlaceholder}
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? profileMessages.submitting
                : profileMessages.submit}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
