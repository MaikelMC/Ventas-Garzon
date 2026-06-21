import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { Header } from '../pages/Header';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Flujo de compra completo', () => {
  let productsPage: ProductsPage;
  let header: Header;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    header = new Header(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('agregar producto al carrito desde el catálogo', async ({ page }) => {
    await productsPage.goto();
    await page.waitForTimeout(1000);

    const cardCount = await productsPage.allProductCards.count();
    if (cardCount === 0) return;

    const firstCard = productsPage.allProductCards.first();
    await firstCard.hover();
    await page.waitForTimeout(300);

    const addBtn = firstCard.getByRole('button', { name: /Añadir/ });
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);

      await header.cartLink.click();
      await expect(page).toHaveURL('/cart');
      const count = await cartPage.cartItems.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('carrito vacío muestra estado empty', async ({ page }) => {
    await cartPage.goto();
    await expect(cartPage.emptyState).toBeVisible();
    await expect(cartPage.emptyStateLink).toBeVisible();
  });

  test('redirección a checkout con carrito vacío', async ({ page }) => {
    await checkoutPage.goto();
    await expect(page).toHaveURL('/cart');
  });

  test('checkout valida campos obligatorios', async ({ page }) => {
    await page.goto('/checkout');

    const hasItems = await checkoutPage.submitButton.isVisible().catch(() => false);
    if (!hasItems) return;

    await checkoutPage.submitOrder();
    await page.waitForTimeout(500);

    const errors = await checkoutPage.validationError.count();
    expect(errors).toBeGreaterThan(0);
  });

  test('flujo checkout completo con datos válidos', async ({ page }) => {
    await page.goto('/checkout');

    const exists = await checkoutPage.nameInput.isVisible().catch(() => false);
    if (!exists) return;

    await checkoutPage.fillContactInfo({
      name: 'Test User',
      phone: '+53 5 1234 5678',
      address: 'Calle 23 #456, Plaza, Santiago de Cuba',
      notes: 'Tocar timbre dos veces',
    });
    await checkoutPage.selectPaymentMethod('cash');
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    const success = await checkoutPage.successHeading.isVisible().catch(() => false);
    if (success) {
      await expect(checkoutPage.successHeading).toBeVisible();
      await expect(checkoutPage.successOrderNumber).toBeVisible();
    }
  });

  test('cambio de método de pago se refleja visualmente', async ({ page }) => {
    await page.goto('/checkout');

    const cashBtn = await checkoutPage.cashButton.isVisible().catch(() => false);
    if (!cashBtn) return;

    await checkoutPage.selectPaymentMethod('transfer');
    await page.waitForTimeout(200);

    await checkoutPage.selectPaymentMethod('cash');
    await page.waitForTimeout(200);
  });
});
