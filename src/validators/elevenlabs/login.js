async function loginElevenLabs(page, email, password) {
  try {
    await page.goto('https://elevenlabs.io/sign-in', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForSelector('[data-testid="sign-in-email-input"]', { timeout: 15000 });
    await page.fill('[data-testid="sign-in-email-input"]', email);
    await page.fill('[data-testid="sign-in-password-input"]', password);

    const loginButton = page.locator('[data-testid="sign-in-submit-button"]');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();

    const result = await Promise.race([
      page.waitForFunction(() => window.location.href.includes('/app'), {
        timeout: 20000
      }).then(() => 'success'),

      page.locator('text=/no user|unable to sign in|invalid|incorrect/i')
        .first()
        .waitFor({ timeout: 20000 })
        .then(() => 'error'),

      page.waitForTimeout(20000).then(() => 'timeout')
    ]);

    if (result === 'error') {
      return { success: false, error: 'invalid_credentials' };
    }

    if (result === 'timeout') {
      return { success: false, error: 'unknown_login_state' };
    }
    return { success: true };

  } catch (err) {
    console.log('Login Error:', err.message);
    return { success: false, error: 'unexpected_error' };
  }
}

module.exports = { loginElevenLabs };