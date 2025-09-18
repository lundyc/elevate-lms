const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cron = require('node-cron');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
const installRoutes = require('./routes/install');
const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const playersRoutes = require('./routes/players');
const fixturesRoutes = require('./routes/fixtures');
const paymentsRoutes = require('./routes/payments');
const settingsRoutes = require('./routes/settings');
const rolloversRoutes = require('./routes/rollovers');

app.use('/api/install', installRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/fixtures', fixturesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/rollovers', rolloversRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Cron jobs: sync fixtures & results
const { syncFixtures } = require('./jobs/syncFixtures');
const { updateResults } = require('./jobs/updateResults');
cron.schedule('0 3 * * 1', () => syncFixtures());      // Every Monday at 3 AM
cron.schedule('0 2 * * *', () => updateResults());      // Daily at 2 AM

app.listen(port, () => {
  console.log(`Backend API running on port ${port}`);
});
