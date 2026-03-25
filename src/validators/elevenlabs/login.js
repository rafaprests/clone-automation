async function loginElevenLabs(page, email, password) {
  try {
    await page.goto('https://elevenlabs.io/sign-in', {
      waitUntil: 'domcontentloaded'
    });

    await page.fill('[data-testid="sign-in-email-input"]', email);
    await page.fill('[data-testid="sign-in-password-input"]', password);

    await page.click('[data-testid="sign-in-submit-button"]');

    const result = await Promise.race([
      page.getByRole('button', { name: 'Seu perfil' })
        .waitFor({ timeout: 15000 })
        .then(() => 'success'),

      page.locator('text=/no user|unable to sign in|invalid|incorrect/i')
        .waitFor({ timeout: 15000 })
        .then(() => 'error'),

      page.waitForTimeout(15000).then(() => 'timeout')
    ]);

    if (result === 'error') {
      return { success: false, error: 'invalid_credentials' };
    }

    if (result === 'timeout') {
      return { success: false, error: 'unknown_login_state' };
    }

    return { success: true };

  } catch {
    return { success: false, error: 'unexpected_error' };
  }
}

module.exports = { loginElevenLabs };