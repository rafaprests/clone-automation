async function getElevenLabsPlan(page) {
  try {
    await page.getByTestId('user-menu-button').first().click();

    const planText = await page.locator('text=/Free plan|Creator|Plano Free/i').first().innerText();

    const isCreator = /creator/i.test(planText);

    return {
      success: true,
      plan: isCreator ? 'creator' : 'free'
    };

  } catch (err) {
    console.log('Plan Check Error:', err.message);

    return {
      success: false,
      error: 'plan_check_failed'
    };
  }
}

module.exports = { getElevenLabsPlan };