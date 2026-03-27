const { findMediaFiles } = require('../../utils/fileHelper');

async function createElevenLabsClone(page, user) {
  try {
    const { audios } = findMediaFiles(user.name);

    if (!audios || audios.length === 0) {
      return {
        success: false,
        error: 'no_audio_found'
      };
    }

    console.log(`📁 ${audios.length} áudios encontrados`);

    // 👉 navegação
    await page.locator('#main-nav').getByRole('link', { name: /voices|vozes/i }).click();
    await page.getByTestId('voices-nav-my-voices').click();
    await page.getByTestId('create-voice-button').click();

    // 👉 clone profissional
    const professionalButton = page.getByRole('button', {
      name: /clone de voz profissional|professional voice clone/i
    });

    if (!(await professionalButton.isVisible()) || await professionalButton.isDisabled()) {
      return {
        success: false,
        error: 'professional_slot_unavailable'
      };
    }

    await professionalButton.click();

    // 👉 nome
    await page.getByTestId('pvc-voice-name-input').fill(user.name);

    // 👉 linguagem
    await page.getByTestId('pvc-language-select').click();
    await page.getByText(/portuguese/i).click();

    // 👉 sotaque
    await page.getByRole('combobox').click();
    await page.getByText(/brazil/i).click();

    // 👉 PRIMEIRO BOTÃO (novo)
    await page.getByTestId('pvc-create-new-clone-button').click();

    // 👉 SEGUNDO BOTÃO (confirmação)
    await page.getByTestId('pvc-create-clone-button').click();

    // 👉 upload
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(audios);

    console.log('📤 Áudios enviados');

    // 👉 esperar upload completo
    const result = await Promise.race([
      page.getByLabel(/reproduzir áudio|play audio/i)
        .first()
        .waitFor({ timeout: 60000 })
        .then(() => 'success'),

      page.waitForTimeout(60000).then(() => 'timeout')
    ]);

    if (result === 'timeout') {
      return {
        success: false,
        error: 'audio_upload_timeout'
      };
    }

    console.log('✅ Upload concluído');

    return {
      success: true
    };

  } catch (err) {
    console.log('Erro ElevenLabs clone:', err.message);

    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = { createElevenLabsClone };