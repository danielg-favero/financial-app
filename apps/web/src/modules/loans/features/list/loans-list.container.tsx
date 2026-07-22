"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { ListLoansService } from "@/modules/loans/api/services/list-loans.service";
import { useLoansListModel } from "@/modules/loans/features/list/loans-list.model";
import { LoansListView } from "@/modules/loans/features/list/loans-list.view";

const httpClient = new HttpClient();
const listLoansService = new ListLoansService(httpClient);

export function LoansListContainer() {
  const model = useLoansListModel({ listLoansService });

  return <LoansListView {...model} />;
}
