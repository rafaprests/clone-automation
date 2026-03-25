async function validateElevenLabs(page, email, password) {
  try {
    await page.goto('https://elevenlabs.io/sign-in', {
      waitUntil: 'domcontentloaded'
    });

    await page.waitForSelector('[data-testid="sign-in-email-input"]');

    await page.fill('[data-testid="sign-in-email-input"]', email);
    await page.fill('[data-testid="sign-in-password-input"]', password);

    const loginButton = page.locator('[data-testid="sign-in-submit-button"]');

    await page.waitForFunction(
      (btn) => !btn.disabled,
      await loginButton.elementHandle()
    );

    await loginButton.click();

    // await page.pause(); // pausa para depuração, remover depois

    const result = await Promise.race([
      page.getByRole('button', { name: 'Seu perfil' }).waitFor({ timeout: 15000 }).then(() => 'success'),

      // 👇 NOVO ERRO REAL
      page.locator('text=/no user|unable to sign in|invalid|wrong|error/i')
        .waitFor({ timeout: 15000 })
        .then(() => 'error'),

      page.waitForTimeout(15000).then(() => 'timeout')
    ]);

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

    // clicar no perfil
    const profileButton = page.getByRole('button', { name: 'Seu perfil' });
    await profileButton.waitFor({ state: 'visible', timeout: 15000 });
    await profileButton.click();

    // esperar menu abrir
    const subscriptionLink = page.getByRole('link', { name: 'Assinatura', exact: true });
    await subscriptionLink.waitFor();
    await subscriptionLink.click();

    // pegar texto do plano
    const planText = await page
      .getByText(/Você está atualmente no plano/i)
      .innerText();

    const isCreator = /creator/i.test(planText);

    return {
      success: true,
      plan: isCreator ? 'creator' : 'free'
    };

  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = { validateElevenLabs };