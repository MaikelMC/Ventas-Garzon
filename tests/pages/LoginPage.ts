import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly backToStoreLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('tu@email.com');
    this.passwordInput = page.getByPlaceholder('••••••••');
    this.submitButton = page.getByRole('button', { name: /^Iniciar Sesión$/ });
    this.errorMessage = page.locator('.text-red-600.dark\\:text-red-400 span.text-sm');
    this.registerLink = page.getByRole('link', { name: /Regístrate aquí/ });
    this.forgotPasswordLink = page.getByRole('link', { name: /¿Olvidaste tu contraseña/ });
    this.backToStoreLink = page.getByRole('link', { name: /Volver a la tienda/ });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
