import { type Page, type Locator } from '@playwright/test';

export class OrdersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emptyState: Locator;
  readonly emptyStateMessage: Locator;
  readonly errorAlert: Locator;
  readonly orderCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Mis Pedidos' });
    this.emptyState = page.getByText(/Aún no has realizado ningún pedido|No hay pedidos en este estado/);
    this.emptyStateMessage = page.locator('p.text-ink-muted');
    this.errorAlert = page.locator('[class*="text-error"]').filter({ has: page.locator('svg.lucide-alert-circle') });
    this.orderCards = page.locator('[class*="rounded-2xl"]').filter({ has: page.locator('text=/Pedido #/') });
  }

  async goto() {
    await this.page.goto('/orders');
  }

  statusFilter(statusLabel: string): Locator {
    return this.page.getByRole('button', { name: statusLabel, exact: true });
  }

  async filterByStatus(statusLabel: string) {
    await this.statusFilter(statusLabel).click();
  }

  orderCard(orderNumber: number): Locator {
    return this.page.locator('button[aria-expanded]', { hasText: `Pedido #${orderNumber}` });
  }

  async toggleOrderDetail(orderNumber: number) {
    await this.orderCard(orderNumber).click();
  }

  async isOrderExpanded(orderNumber: number): Promise<boolean> {
    const expanded = await this.orderCard(orderNumber).getAttribute('aria-expanded');
    return expanded === 'true';
  }

  orderItem(orderNumber: number, productName: string): Locator {
    return this.page.locator(`#order-detail-${orderNumber}`).locator('text=' + productName);
  }

  paginationButton(pageNumber: number): Locator {
    return this.page.getByRole('button', { name: `Ir a página ${pageNumber}` });
  }

  async goToPage(pageNumber: number) {
    await this.paginationButton(pageNumber).click();
  }
}
