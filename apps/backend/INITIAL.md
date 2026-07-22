# How I do it today

A yearly budget-and-spending tracker (in Portuguese) built around three sheets that work together: income, investments, and expenses tracked month by month, plus a side ledger for money lent to friends.

## Sheet 1 — "Receitas e Despesas" (Income & Expenses)

This is the main engine. Columns run across the 12 months (Jan–Dez), with some months split into a starred column and a plain column — the `*` version is the **planned/budgeted** figure and the plain one the **actual**, so I can compare forecast vs. reality (visible around Abr–Jul). The far-right column totals each row for the year.

It's organized into stacked blocks:

- **RECEITAS (Income)** — Salário (recorrente, R$8.000/mo), Freelance, Outros, with a Total row. Year-to-date income is about R$63k.
- **INVESTIMENTOS** — money moved into/out of things like Tesouro Direto, an apartment fund ("Nosso Ap."), a course. Negative numbers here mean withdrawals.
- **DESPESAS (Expenses)** — the biggest section, split into two categories:
  - _Despesas Mensais Fixas_ — recurring bills grouped by subcategories: Moradia (rent, condo, internet, phone, power, groceries), Saúde (two therapists), Segurança, Lazer (Spotify/Disney+), CNPJ (self-employment taxes, accountant), Trabalho (Claude.ai).
  - _Despesas Mensais Variáveis_ — discretionary/irregular: Transporte, Carro, Viagens, Lazer, Alimentação, Carreira, Farmácia, Vestuário, Cuidados pessoais, Outros.

Each subcategory has its own Subtotal row, and each block rolls up into a big total.

**SALDO (Balance)** at the bottom is the summary: it pulls Receitas, Investimentos, and Despesas for each month and computes **Saldo Final** = whether that month ended positive or negative. This balance means the amount of money I have left in my wallet

## Sheet 2 — "Valores a receber" (Money owed to me)

A running ledger of money I fronted for friends — date, name, description, amount lent, amount received back, open balance, and a TRUE/FALSE "paid?" status. The subtotal at top sums what's still outstanding (roughly R$1.879 open). Examples: shared dinners, concert tickets split, small loans.

## How it works together

I log actual income and each expense in the monthly columns of Sheet 1; subtotals and the SALDO block automatically tell me if each month is in the black or red. Sheet 2 keeps informal loans from getting lost.
