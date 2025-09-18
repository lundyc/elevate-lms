const prisma = require('./prisma');
const { fetchPremierLeagueFixtures } = require('./fixtures');
const { sendEmail } = require('./email');

async function syncFixtures() {
  // Pull fixtures from API, insert/update DB.
  // Log to job_log table.
}

async function updateResults() {
  // Check finished matches, update results in DB.
  // Eliminate players accordingly.
}

module.exports = { syncFixtures, updateResults };
