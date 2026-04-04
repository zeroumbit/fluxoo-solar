import { test, expect } from '@playwright/test';

/**
 * Fluxo Crítico: Onboarding Completo (Regra 1)
 */
test.describe('Onboarding de Nova Empresa', () => {
    test('veja o fluxo completo de registro até o dashboard', async ({ page }) => {
        // 1. Acesso à página de signup
        await page.goto('/signup');

        // 2. Passo 1: Dados do Usuário
        await page.getByLabel(/nome completo/i).fill('Admin Teste');
        await page.getByLabel(/e-mail/i).fill(`test-${Date.now()}@fluxoo.com`);
        await page.getByLabel(/senha/i).fill('Password123!');
        await page.getByRole('button', { name: /próximo/i }).click();

        // 3. Passo 2: Dados da Empresa (Tenant)
        await page.getByLabel(/razão social/i).fill('Empresa Solar Teste LTDA');
        await page.getByLabel(/cnpj/i).fill('12.345.678/0001-90');
        await page.getByLabel(/tipo/i).click();
        await page.getByText(/integradora/i).click();
        await page.getByRole('button', { name: /concluir/i }).click();

        // 4. Verificação final (Auto-waiting locator)
        await expect(page.getByRole('heading', { name: /bem-vindo/i })).toBeVisible();
        await expect(page).toHaveURL(/.*dashboard/);
    });
});
