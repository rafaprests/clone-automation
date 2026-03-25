const { loginHeygen } = require('./login');
const { getHeygenPlan } = require('./plan');

async function validateHeygen(page, email, password) {
  const login = await loginHeygen(page, email, password);

  if (!login.success) {
    return login;
  }

  // await page.pause();

  const plan = await getHeygenPlan(page);

  if (!plan.success) {
    return plan;
  }

  return {
    success: true,
    plan: plan.plan
  };
}

module.exports = { validateHeygen };