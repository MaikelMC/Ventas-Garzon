import { type Page, type Locator } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly aboutLink: Locator;
  readonly faqLink: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly mobileMenuButton: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly userMenuButton: Locator;
  readonly profileLink: Locator;
  readonly ordersLink: Locator;
  readonly logoutButton: Locator;
  readonly darkModeToggle: Locator;
  readonly adminLink: Locator;
  readonly mobileMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByRole('link', { name: /Ventas Garzón/ });
    this.homeLink = this.logo;
    this.productsLink = page.getByRole('link', { name: 'Productos' }).first();
    this.aboutLink = page.getByRole('link', { name: 'Nosotros' }).first();
    this.faqLink = page.getByRole('link', { name: 'FAQ' }).first();
    this.cartLink = page.getByRole('link').filter({ has: page.locator('[class*="lucide-shopping-cart"]') });
    this.cartBadge = page.locator('[class*="from-secondary-500"]');
    this.mobileMenuButton = page.locator('button.md\\:hidden').first();
    this.loginLink = page.getByRole('link', { name: /Ingresar/ });
    this.registerLink = page.getByRole('link', { name: /Registrarse/ });
    this.userMenuButton = page.locator('button').filter({ has: page.locator('[class*="rounded-full bg-surface-100"]') }).first();
    this.profileLink = page.getByRole('link', { name: /Mi Perfil/ });
    this.ordersLink = page.getByRole('link', { name: /Mis Pedidos/ });
    this.logoutButton = page.getByRole('button', { name: /Cerrar Sesión/ });
    this.darkModeToggle = page.getByRole('button', { name: 'Toggle dark mode' });
    this.adminLink = page.getByRole('link', { name: /Admin/ }).first();
    this.mobileMenu = page.locator('.md\\:hidden').filter({ has: page.locator('[class*="overflow-hidden"]') });
  }

  async gotoHome() {
    await this.logo.click();
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
  }

  async openUserMenu() {
    await this.userMenuButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async toggleDarkMode() {
    await this.darkModeToggle.click();
  }

  cartItemCount(): Locator {
    return this.cartBadge;
  }
}
