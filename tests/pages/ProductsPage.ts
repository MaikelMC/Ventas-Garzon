import { type Page, type Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly loadMoreButton: Locator;
  readonly emptyState: Locator;
  readonly emptyStateMessage: Locator;
  readonly clearFiltersButton: Locator;
  readonly retryButton: Locator;
  readonly allProductCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByLabel('Buscar productos');
    this.loadMoreButton = page.getByRole('button', { name: /Ver más/ });
    this.emptyState = page.getByText('Sin resultados');
    this.emptyStateMessage = page.locator('p').filter({ hasText: /No encontramos/ });
    this.clearFiltersButton = page.getByRole('button', { name: 'Limpiar filtros' });
    this.retryButton = page.getByRole('button', { name: /Intentar de nuevo/ });
    this.allProductCards = page.locator('article');
  }

  async goto() {
    await this.page.goto('/products');
  }

  categoryButton(categoryName: string): Locator {
    return this.page.getByRole('button', { name: categoryName, exact: true });
  }

  async selectCategory(categoryName: string) {
    await this.categoryButton(categoryName).click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async loadMore() {
    await this.loadMoreButton.click();
  }

  productCard(productName: string): Locator {
    return this.allProductCards.filter({ has: this.page.getByRole('heading', { name: productName, exact: true }) });
  }

  addToCartButton(productName: string): Locator {
    return this.page.getByRole('button', { name: `Añadir ${productName} al carrito` });
  }

  async addToCart(productName: string) {
    await this.addToCartButton(productName).click();
  }
}
