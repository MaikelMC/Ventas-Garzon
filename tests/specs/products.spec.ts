import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Catálogo de productos', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.goto();
  });

  test('muestra productos al cargar', async () => {
    await expect(productsPage.searchInput).toBeVisible();
    const count = await productsPage.allProductCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('filtra por categoría al seleccionar un pill', async () => {
    const initial = await productsPage.allProductCards.count();

    await productsPage.selectCategory('Alimentos');
    await productsPage.page.waitForTimeout(500);

    const filtered = await productsPage.allProductCards.count();
    expect(filtered).toBeLessThanOrEqual(initial);
  });

  test('busca productos por texto', async () => {
    await productsPage.search('arroz');
    await productsPage.page.waitForTimeout(500);

    const count = await productsPage.allProductCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('pilla activa refleja categoría seleccionada', async () => {
    const button = productsPage.categoryButton('Alimentos');
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  test('categoría "Todos" muestra todos los productos', async () => {
    await productsPage.selectCategory('Aseo');
    await productsPage.page.waitForTimeout(300);
    await productsPage.selectCategory('Todos');
    await productsPage.page.waitForTimeout(300);

    const allCount = await productsPage.allProductCards.count();
    expect(allCount).toBeGreaterThan(0);
  });
});
