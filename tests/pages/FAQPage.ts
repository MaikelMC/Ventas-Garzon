import { type Page, type Locator } from '@playwright/test';

export class FAQPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly noResultsMessage: Locator;
  readonly contactSupportLink: Locator;
  readonly accordionItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Buscar... (Ctrl+K)');
    this.clearSearchButton = page.getByRole('button', { name: 'Limpiar búsqueda' });
    this.noResultsMessage = page.getByText('No encontramos resultados');
    this.contactSupportLink = page.getByRole('link', { name: /Contactar Soporte/ });
    this.accordionItems = page.locator('[class*="rounded-xl"]').filter({ has: page.locator('button[aria-expanded]') });
  }

  async goto() {
    await this.page.goto('/faq');
  }

  categoryFilter(categoryLabel: string): Locator {
    return this.page.getByRole('button', { name: categoryLabel, exact: true });
  }

  async filterByCategory(categoryLabel: string) {
    await this.categoryFilter(categoryLabel).click();
  }

  faqQuestion(questionText: string): Locator {
    return this.page.locator('button[aria-expanded]', { hasText: questionText });
  }

  async toggleFaq(questionText: string) {
    await this.faqQuestion(questionText).click();
  }

  faqAnswer(questionText: string): Locator {
    return this.page.locator('button[aria-expanded="true"]', { hasText: questionText }).locator('..').locator('..').locator('[role="region"] p');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }
}
