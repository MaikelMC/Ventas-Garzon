import { test, expect } from '@playwright/test';
import { Header } from '../pages/Header';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { FAQPage } from '../pages/FAQPage';

test.describe('Navegación principal', () => {
  let header: Header;

  test.beforeEach(async ({ page }) => {
    header = new Header(page);
    await page.goto('/');
  });

  test('header muestra enlaces principales', async () => {
    await expect(header.productsLink).toBeVisible();
    await expect(header.aboutLink).toBeVisible();
    await expect(header.faqLink).toBeVisible();
    await expect(header.cartLink).toBeVisible();
  });

  test('navegación a productos', async ({ page }) => {
    await header.productsLink.click();
    await expect(page).toHaveURL('/products');
    await expect(page.getByRole('heading', { name: 'Productos' })).toBeVisible();
  });

  test('navegación a FAQ', async ({ page }) => {
    await header.faqLink.click();
    await expect(page).toHaveURL('/faq');
    await expect(page.getByRole('heading', { name: '¿Tienes dudas?' })).toBeVisible();
  });

  test('navegación a carrito', async ({ page }) => {
    await header.cartLink.click();
    await expect(page).toHaveURL('/cart');
  });

  test('enlace de login redirige correctamente', async ({ page }) => {
    await header.loginLink.click();
    await expect(page).toHaveURL('/login');
  });
});

test.describe('LandingPage', () => {
  test('carga con título y secciones visibles', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ventas Garzón/);
  });
});
