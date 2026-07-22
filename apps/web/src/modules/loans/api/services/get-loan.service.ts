import type { IHttpClient } from "@/shared/infra/http/client";

import type { ILoan, ILoanResponse } from "@/modules/loans/types/loan";

export class GetLoanService {
  constructor(private httpClient: IHttpClient) {}

  async execute(id: string): Promise<ILoan> {
    const response = await this.httpClient.get<ILoanResponse>(`/loans/${id}`);
    return response.loan;
  }
}
