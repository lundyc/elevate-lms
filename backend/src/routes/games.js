const express = require('express');
const prisma = require('../services/prisma');
const router = express.Router();
const { checkJwt } = require('../services/auth');

// GET /api/games
router.get('/', checkJwt, async (req, res) => {
  const games = await prisma.games.findMany();
  return res.json(games);
});

// POST /api/games
router.post('/', checkJwt, async (req, res) => {
  const { teamId, name, startWeek, entryFee, prizePercentage, buybackWeek } = req.body;
  const game = await prisma.games.create({
    data: {
      team_id: parseInt(teamId),
      name,
      start_week: parseInt(startWeek),
      entry_fee: parseFloat(entryFee),
      prize_percentage: parseFloat(prizePercentage),
      buyback_week: parseInt(buybackWeek)
    }
  });
  return res.json(game);
});

module.exports = router;
