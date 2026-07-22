import type { Metadata } from "next";

import {
  CreateTransactionContainer,
  DeleteTransactionContainer,
  EditTransactionContainer,
  TransactionsListContainer,
} from "@/modules/transactions";

export const metadata: Metadata = {
  title: "Transações",
};

export default function TransactionsPage() {
  return (
    <>
      <TransactionsListContainer />
      <CreateTransactionContainer />
      <EditTransactionContainer />
      <DeleteTransactionContainer />
    </>
  );
}
