const { findMediaFiles } = require('../../utils/fileHelper');

async function createHeygenClone(page, user) {
  try {
    const { video } = findMediaFiles(user.name);

    if (!video) {
      return {
        success: false,
        error: 'video_not_found'
      };
    }

    console.log('📁 Vídeo encontrado:', video);

    await page.getByRole('button', { name: 'Avatars' }).click();
    await page.getByRole('button', { name: 'Create Avatar' }).click();
    await page.getByRole('heading', { name: 'Clone a real person' }).click();
    await page.getByText('upload footage').click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.waitFor({ state: 'attached', timeout: 10000 });

    await fileInput.setInputFiles(video);

    console.log('📤 Upload enviado');

    // nome (opcional)
    const nameInput = page.getByRole('textbox', { name: 'Name your avatar' });
    if (await nameInput.isVisible()) {
      await nameInput.fill(user.name);
    }

    await page.getByRole('button', { name: 'Create Avatar' }).click();

    console.log('⏳ Criando avatar...');

    // 🔥 ESPERAR FINALIZAÇÃO REAL
    const result = await Promise.race([
      // sucesso
      page.getByRole('button', { name: 'Use in a video' })
        .waitFor({ timeout: 120000 }) // 2 minutos
        .then(() => 'success'),

      // fallback timeout longo
      page.waitForTimeout(120000).then(() => 'timeout')
    ]);

    if (result === 'timeout') {
      return {
        success: false,
        error: 'avatar_creation_timeout'
      };
    }

    console.log('✅ Avatar criado com sucesso');

    return {
      success: true
    };

  } catch (err) {
    console.log('Erro criação HeyGen:', err.message);

    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = { createHeygenClone };