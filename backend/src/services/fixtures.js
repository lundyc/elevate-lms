const axios = require('axios');
const { footballDataApiKey } = require('../config');

const api = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: { 'X-Auth-Token': footballDataApiKey }
});

async function fetchPremierLeagueFixtures(season) {
  const response = await api.get(`/competitions/PL/matches?season=${season}`);
  return response.data.matches;
}

module.exports = { fetchPremierLeagueFixtures };
