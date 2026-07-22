import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { formatCurrency } from "@/shared/lib/formatters";

import { registerPaymentMessages } from "@/modules/loans/features/register-payment/register-payment.messages";
import type { IRegisterPaymentModel } from "@/modules/loans/features/register-payment/register-payment.model";

const FORM_ID = "register-payment-form";

export function RegisterPaymentView({
  personName,
  openBalance,
  form,
  onSubmit,
  onClose,
  isSubmitting,
}: Readonly<IRegisterPaymentModel>) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{registerPaymentMessages.title}</DialogTitle>
          <DialogDescription>
            {registerPaymentMessages.description(personName)}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {registerPaymentMessages.openBalanceLabel}:{" "}
          <span className="font-mono text-foreground">{formatCurrency(openBalance)}</span>
        </p>
        <Form {...form}>
          <form id={FORM_ID} onSubmit={onSubmit} noValidate>
            <FormField
              control={form.control}
              name="paymentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{registerPaymentMessages.amountLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder={registerPaymentMessages.amountPlaceholder}
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {registerPaymentMessages.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting
              ? registerPaymentMessages.submitting
              : registerPaymentMessages.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
