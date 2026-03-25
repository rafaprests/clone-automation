async function validateHeygen(page, email, password) {
  try {
    await page.goto('https://app.heygen.com/login');

    // clicar em email
    await page.getByRole('button', { name: /continue with email/i }).click();

    // preencher email
    await page.fill('input[type="email"]', email);

    // clicar em usar senha
    await page.getByRole('button', { name: /use password instead/i }).click();

    // preencher senha
    await page.fill('input[type="password"]', password);

    // clicar no login
    await page.click('button:has-text("Log in")');

    // 👇 corrida entre sucesso e erro
    const result = await Promise.race([
      // sucesso → elemento do dashboard (ajustável)
      page.locator('[aria-haspopup="dialog"]').first().waitFor({ timeout: 15000 }).then(() => 'success'),

      // erro de credenciais
      page.getByText('Invalid username/password')
        .waitFor({ timeout: 15000 })
        .then(() => 'error'),

      // fallback
      page.waitForTimeout(15000).then(() => 'timeout')
    ]);

    // 👇 tratamento de erro
    if (result === 'error') {
      return {
        success: false,
        error: 'invalid_credentials'
      };
    }

    if (result === 'timeout') {
      return {
        success: false,
        error: 'unknown_login_state'
      };
    }

    // 👇 só entra aqui se logou

    await page.locator('[aria-haspopup="dialog"]').first().click();

    const isCreator = await page.locator('text=Creator').isVisible();

    return {
      success: true,
      plan: isCreator ? 'creator' : 'free'
    };

  } catch (err) {
    return {
      success: false,
      error: 'unexpected_error'
    };
  }
}

module.exports = { validateHeygen };