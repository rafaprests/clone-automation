async function getHeygenPlan(page) {
  try {
    await page.locator('[aria-haspopup="dialog"]').first().click();

    const isCreator = await page.locator('text=Creator').isVisible();

    return {
      success: true,
      plan: isCreator ? 'creator' : 'free'
    };

  } catch {
    return {
      success: false,
      error: 'plan_check_failed'
    };
  }
}

module.exports = { getHeygenPlan };