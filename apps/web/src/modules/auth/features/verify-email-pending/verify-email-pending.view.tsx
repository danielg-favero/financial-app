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

import { verifyEmailPendingMessages } from "@/modules/auth/features/verify-email-pending/verify-email-pending.messages";

export function VerifyEmailPendingView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{verifyEmailPendingMessages.title}</CardTitle>
        <CardDescription>{verifyEmailPendingMessages.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3" role="status" aria-live="polite">
          <MailCheck className="size-5 shrink-0 text-primary-strong" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <p>{verifyEmailPendingMessages.instructions}</p>
            <p className="text-sm text-muted-foreground">{verifyEmailPendingMessages.hint}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-4">
        <Button className="w-full" asChild>
          <Link href="/auth/signin">{verifyEmailPendingMessages.goToSignIn}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
