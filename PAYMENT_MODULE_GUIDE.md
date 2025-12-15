# Payment Module Documentation

The Payment Module enables financial management within the school tenant, handling categories, invoicing, and payment tracking.

## 1. Features
- **Payment Categories**: Define types of fees (e.g., Tuition, Books, Uniform) with default amounts.
- **Invoicing**: Create bills for specific students with due dates.
- **Payment Recording**: Log partial or full payments against invoices.
- **Financial Dashboard**: View total collected and outstanding amounts.

## 2. Component Structure

### Pages
- `src/app/(tenant)/[slug]/admin/payments/page.tsx`: The main dashboard entry point.

### Components
- `CreateCategoryDialog.tsx`: Defines new fee types.
- `CreateInvoiceDialog.tsx`: Generates a new bill for a student.
- `RecordPaymentDialog.tsx`: Modal to accept payment for an invoice.

### Server Actions
- `src/lib/actions/payments.ts`: Handles all DB operations (createInvoice, recordPayment, etc.).

## 3. Usage Guide

### Setting up Categories
1. Click **New Category**.
2. Enter a name (e.g., "SPP 2024") and optional default amount.
3. This category will now be available when creating invoices.

### Creating an Invoice
1. Click **Create Invoice**.
2. Select a Student.
3. Select a Category (will auto-fill amount if set).
4. Set a Due Date and Title (e.g., "October Tuition").
5. Click Create.

### Recording Payment
1. Locate the invoice in the list.
2. Click the **Pay** button.
3. Enter the amount being paid (defaults to remaining balance).
4. Select method (Cash/Transfer).
5. Confirm. The invoice status will update to 'Paid' or 'Partial' automatically.

## 4. Updates to Schema
Added tables:
- `payment_categories`
- `invoices`
- `payments`

Ensure you run `npx drizzle-kit push` to apply these schema changes.
