import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const getBitcoinHistory = async (days = 30) => {
  try {
    const response = await axios.get(`${COINGECKO_BASE_URL}/coins/bitcoin/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: 'daily'
      }
    });
    return response.data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp),
      price: price
    }));
  } catch (error) {
    console.error('Error fetching Bitcoin history:', error);
    return [];
  }
};
