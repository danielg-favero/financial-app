import type { IHttpClient } from "@/shared/infra/http/client";
import type { IBulkCreateResponse } from "@/shared/infra/http/bulk";

import type { ILoan } from "@/modules/loans/types/loan";

export interface ICreateLoanDTO {
  loanDate: string;
  personName: string;
  description: string;
  amountLent: number;
}

export class CreateLoanService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dtos: ICreateLoanDTO[]): Promise<IBulkCreateResponse<ILoan>> {
    return this.httpClient.post<IBulkCreateResponse<ILoan>, ICreateLoanDTO[]>("/loans", dtos);
  }
}
