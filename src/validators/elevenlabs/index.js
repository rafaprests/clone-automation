const { loginElevenLabs } = require('./login');
const { getElevenLabsPlan } = require('./plan');

async function validateElevenLabs(page, email, password) {
  const login = await loginElevenLabs(page, email, password);

  if (!login.success) {
    return {
      success: false,
      stage: 'login',
      error: login.error
    };
  }

  const plan = await getElevenLabsPlan(page);

  if (!plan.success) {
    return {
      success: false,
      stage: 'plan',
      error: plan.error
    };
  }

  return {
    success: true,
    plan: plan.plan
  };
}

module.exports = { validateElevenLabs };