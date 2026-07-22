import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { verifyEmailMessages } from "@/modules/auth/features/verify-email/verify-email.messages";
import type { IVerifyEmailModel } from "@/modules/auth/features/verify-email/verify-email.model";

export function VerifyEmailView({ status, errorMessage }: Readonly<IVerifyEmailModel>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{verifyEmailMessages.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3" role="status" aria-live="polite">
          {status === "verifying" && (
            <>
              <LoaderCircle
                className="size-5 shrink-0 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
              <p>{verifyEmailMessages.verifying}</p>
            </>
          )}
          {status === "success" && (
            <>
              <CircleCheck className="size-5 shrink-0 text-primary-strong" aria-hidden="true" />
              <p>{verifyEmailMessages.success}</p>
            </>
          )}
          {status === "error" && (
            <>
              <CircleX className="size-5 shrink-0 text-destructive" aria-hidden="true" />
              <p>{errorMessage}</p>
            </>
          )}
        </div>
      </CardContent>
      {status !== "verifying" && (
        <CardFooter className="mt-4">
          <Button className="w-full" asChild>
            <Link href="/auth/signin">{verifyEmailMessages.goToSignIn}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
