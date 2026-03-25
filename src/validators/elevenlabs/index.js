const { loginElevenLabs } = require('./login');
const { getElevenLabsPlan } = require('./plan');

async function validateElevenLabs(page, email, password) {
  const login = await loginElevenLabs(page, email, password);

  if (!login.success) {
    return login;
  }

  const plan = await getElevenLabsPlan(page);

  if (!plan.success) {
    return plan;
  }

  return {
    success: true,
    plan: plan.plan
  };
}

module.exports = { validateElevenLabs };