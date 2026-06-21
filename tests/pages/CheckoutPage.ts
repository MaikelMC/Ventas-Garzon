import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly notesInput: Locator;
  readonly cashButton: Locator;
  readonly transferButton: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successHeading: Locator;
  readonly successOrderNumber: Locator;
  readonly successMessage: Locator;
  readonly viewOrdersButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly orderSummaryTitle: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nombre completo *');
    this.phoneInput = page.getByLabel('Teléfono *');
    this.addressInput = page.getByLabel('Dirección de entrega *');
    this.notesInput = page.getByLabel('Notas del pedido (opcional)');
    this.cashButton = page.getByRole('button', { name: /Efectivo/ });
    this.transferButton = page.getByRole('button', { name: /Transferencia/ });
    this.submitButton = page.getByRole('button', { name: /Confirmar Pedido/ });
    this.errorMessage = page.locator('[class*="text-error"]').filter({ has: page.locator('svg.lucide-alert-circle') }).locator('span');
    this.successHeading = page.getByRole('heading', { name: /¡Pedido Recibido!/ });
    this.successOrderNumber = page.locator('text=/Pedido #VG-/');
    this.successMessage = page.getByText(/Te esperamos en tienda/);
    this.viewOrdersButton = page.getByRole('button', { name: /Ver Mis Pedidos/ });
    this.continueShoppingButton = page.getByRole('button', { name: /Seguir Comprando/ });
    this.orderSummaryTitle = page.getByRole('heading', { name: /Resumen del Pedido/ });
    this.validationError = page.locator('p.text-error');
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillContactInfo(data: { name: string; phone: string; address: string; notes?: string }) {
    await this.nameInput.fill(data.name);
    await this.phoneInput.fill(data.phone);
    await this.addressInput.fill(data.address);
    if (data.notes) {
      await this.notesInput.fill(data.notes);
    }
  }

  async selectPaymentMethod(method: 'cash' | 'transfer') {
    if (method === 'cash') {
      await this.cashButton.click();
    } else {
      await this.transferButton.click();
    }
  }

  async submitOrder() {
    await this.submitButton.click();
  }
}
