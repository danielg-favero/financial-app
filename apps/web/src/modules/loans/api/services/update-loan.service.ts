import type { IHttpClient } from "@/shared/infra/http/client";

import type { ILoan, ILoanResponse } from "@/modules/loans/types/loan";

export interface IUpdateLoanDTO {
  loanDate?: string;
  personName?: string;
  description?: string;
  amountLent?: number;
  amountReceived?: number;
}

export interface IUpdateLoanInput {
  id: string;
  dto: IUpdateLoanDTO;
}

export class UpdateLoanService {
  constructor(private httpClient: IHttpClient) {}

  async execute({ id, dto }: IUpdateLoanInput): Promise<ILoan> {
    const response = await this.httpClient.patch<ILoanResponse, IUpdateLoanDTO>(
      `/loans/${id}`,
      dto,
    );
    return response.loan;
  }
}
