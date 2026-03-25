async function getElevenLabsPlan(page) {
  try {
    const profileButton = page.getByRole('button', { name: 'Seu perfil' });
    await profileButton.click();

    const subscriptionLink = page.getByRole('link', { name: 'Assinatura', exact: true });
    await subscriptionLink.click();

    const planText = await page
      .getByText(/Você está atualmente no plano/i)
      .innerText();

    const isCreator = /creator/i.test(planText);

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

module.exports = { getElevenLabsPlan };