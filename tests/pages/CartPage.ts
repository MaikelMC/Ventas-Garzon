import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly clearCartButton: Locator;
  readonly emptyState: Locator;
  readonly emptyStateMessage: Locator;
  readonly emptyStateLink: Locator;
  readonly summaryTitle: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: /Proceder al Pago/ });
    this.continueShoppingButton = page.getByRole('button', { name: /Seguir Comprando/ });
    this.clearCartButton = page.getByRole('button', { name: /Vaciar Carrito/ });
    this.emptyState = page.getByRole('heading', { name: /Tu carrito está vacío/ });
    this.emptyStateMessage = page.getByText('Agrega productos para comenzar tu compra');
    this.emptyStateLink = page.getByRole('link', { name: /Continuar Comprando/ });
    this.summaryTitle = page.getByRole('heading', { name: 'Resumen' });
    this.cartItems = page.locator('[class*="rounded-2xl"]').filter({ has: page.locator('[class*="flex gap-6"]') });
  }

  async goto() {
    await this.page.goto('/cart');
  }

  cartItemRow(productName: string): Locator {
    return this.cartItems.filter({ has: this.page.getByRole('heading', { name: productName }) });
  }

  quantityDecrement(productName: string): Locator {
    return this.cartItemRow(productName).locator('button').filter({ has: this.page.locator('[class*="lucide-minus"]') });
  }

  quantityIncrement(productName: string): Locator {
    return this.cartItemRow(productName).locator('button').filter({ has: this.page.locator('[class*="lucide-plus"]') });
  }

  removeButton(productName: string): Locator {
    return this.cartItemRow(productName).locator('button').filter({ has: this.page.locator('[class*="lucide-trash"]') });
  }

  quantityDisplay(productName: string): Locator {
    return this.cartItemRow(productName).locator('[class*="rounded-xl"] span');
  }

  async updateQuantity(productName: string, delta: 1 | -1) {
    if (delta > 0) {
      await this.quantityIncrement(productName).click();
    } else {
      await this.quantityDecrement(productName).click();
    }
  }

  async removeItem(productName: string) {
    await this.removeButton(productName).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
