import { LoaderCircle } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";

import { signOutMessages } from "@/modules/auth/features/signout/signout.messages";

export function SignOutView() {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-6" role="status" aria-live="polite">
        <LoaderCircle
          className="size-5 shrink-0 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
        <p>{signOutMessages.loading}</p>
      </CardContent>
    </Card>
  );
}
