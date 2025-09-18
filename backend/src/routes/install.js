const express = require('express');
const prisma = require('../services/prisma');
const { fetchPremierLeagueFixtures } = require('../services/fixtures');
const router = express.Router();

// POST /api/install/setup
router.post('/setup', async (req, res) => {
  try {
    const { stripeKey, footballKey, themeId, platformFee, testMode } = req.body;
    // Save API keys, theme, fee into system_settings
    await prisma.system_settings.upsert({
      where: { key_name: 'installer_complete' },
      update: { value: 'true' },
      create: { key_name: 'installer_complete', value: 'true' }
    });
    await prisma.system_settings.upsert({
      where: { key_name: 'platform_fee_percentage' },
      update: { value: String(platformFee) },
      create: { key_name: 'platform_fee_percentage', value: String(platformFee) }
    });
    await prisma.system_settings.upsert({
      where: { key_name: 'active_theme' },
      update: { value: String(themeId) },
      create: { key_name: 'active_theme', value: String(themeId) }
    });
    await prisma.system_settings.upsert({
      where: { key_name: 'payments_test_mode' },
      update: { value: testMode ? 'true' : 'false' },
      create: { key_name: 'payments_test_mode', value: testMode ? 'true' : 'false' }
    });

    // Fetch fixtures and store them.
    const fixtures = await fetchPremierLeagueFixtures(2025); // Example season
    // Loop through fixtures, insert into DB using prisma.

    return res.json({ message: 'Installer completed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Installer failed' });
  }
});

module.exports = router;
