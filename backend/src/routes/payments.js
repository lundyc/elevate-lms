const express = require('express');
const prisma = require('../services/prisma');
const { createCheckoutSession } = require('../services/stripe');
const { sendEmail } = require('../services/email');
const { testMode } = require('../config');

const router = express.Router();

// POST /api/payments/entry
router.post('/entry', async (req, res) => {
  const { userId, gameId } = req.body;
  const game = await prisma.games.findUnique({ where: { id: gameId } });
  if (!game) return res.status(404).json({ error: 'Game not found' });

  const entryFee = game.entry_fee;
  const isTest = testMode || game.test_mode_override === 1;

  if (isTest) {
    // Test Mode: mark paid immediately
    const payment = await prisma.payments.create({
      data: {
        user_id: userId,
        game_id: gameId,
        amount: entryFee,
        paid: true,
        payment_method: 'test',
        is_test: true,
        type: 'entry'
      }
    });
    // Mark player as paid
    await prisma.players.updateMany({
      where: { user_id: userId, game_id: gameId },
      data: { paid: true }
    });
    // Audit & email
    await sendEmail({
      to: 'player@example.com',
      subject: 'Entry Payment (Test)',
      html: `<p>Your test payment of £${entryFee} for game ${game.name} has been recorded.</p>`
    });
    return res.json({ success: true, payment });
  }

  // Real payment via Stripe
  const session = await createCheckoutSession({ userId, gameId, amount: entryFee });
  return res.json({ url: session.url });
});

module.exports = router;
