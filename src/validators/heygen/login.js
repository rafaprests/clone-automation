async function loginHeygen(page, email, password) {
  try {
    await page.goto('https://app.heygen.com/login');

    await page.getByRole('button', { name: /continue with email/i }).click();
    await page.fill('input[type="email"]', email);

    await page.getByRole('button', { name: /use password instead/i }).click();
    await page.fill('input[type="password"]', password);

    await page.click('button:has-text("Log in")');

    const result = await Promise.race([
      page.locator('[aria-haspopup="dialog"]').first().waitFor({ timeout: 15000 }).then(() => 'success'),

      page.locator('text=/invalid username|invalid password/i')
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

module.exports = { loginHeygen };