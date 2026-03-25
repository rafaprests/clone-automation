const { launchBrowser } = require('./utils/browser');
const { validateHeygen } = require('./validators/heygen');
const { validateElevenLabs } = require('./validators/elevenlabs');
const fs = require('fs');

const users = require('./data/users.json');

(async () => {
  const browser = await launchBrowser();

  const results = [];

  for (const user of users) {
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`\n🔍 Validando: ${user.name}`);

    const result = {
      name: user.name,
      heygen: null,
      elevenlabs: null,
      overall: null
    };

    // 👉 HEYGEN
    result.heygen = await validateHeygen(
      page,
      user.heygen.email,
      user.heygen.password
    );

    if (!result.heygen.success) {
      console.log('❌ HeyGen: credenciais inválidas');
    } else if (result.heygen.plan !== 'creator') {
      console.log(`⚠️ HeyGen plano inválido: ${result.heygen.plan}`);
    } else {
      console.log('✅ HeyGen OK');
    }

    await context.close();

    // 👉 novo contexto (evita conflito de sessão)
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();

    // 👉 ELEVENLABS
    result.elevenlabs = await validateElevenLabs(
      page2,
      user.elevenlabs.email,
      user.elevenlabs.password
    );

    if (!result.elevenlabs.success) {
      console.log('❌ ElevenLabs: credenciais inválidas');
    } else if (result.elevenlabs.plan !== 'creator') {
      console.log(`⚠️ ElevenLabs plano inválido: ${result.elevenlabs.plan}`);
    } else {
      console.log('✅ ElevenLabs OK');
    }

    await context2.close();

    // 👉 STATUS FINAL
    const isValid =
      result.heygen?.success &&
      result.heygen?.plan === 'creator' &&
      result.elevenlabs?.success &&
      result.elevenlabs?.plan === 'creator';

    result.overall = isValid ? 'valid' : 'invalid';

    if (isValid) {
      console.log('🎉 Usuário totalmente válido');
    } else {
      console.log('🚫 Usuário com problemas');
    }

    results.push(result);
  }

  await browser.close();

  // 👉 SALVAR RESULTADO
  fs.writeFileSync('results.json', JSON.stringify(results, null, 2));

  console.log('\n📄 Resultados salvos em results.json');
})();