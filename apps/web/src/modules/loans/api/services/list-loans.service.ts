import type { IHttpClient } from "@/shared/infra/http/client";
import {
  buildListQueryParams,
  type IListParams,
  type IListResponse,
} from "@/shared/infra/http/list";

import type { ILoan, LoanOrderByField } from "@/modules/loans/types/loan";

export type IListLoansParams = IListParams<LoanOrderByField>;

export class ListLoansService {
  constructor(private httpClient: IHttpClient) {}

  async execute(params: IListLoansParams): Promise<IListResponse<ILoan>> {
    return this.httpClient.get<IListResponse<ILoan>>("/loans", {
      params: buildListQueryParams(params),
    });
  }
}
