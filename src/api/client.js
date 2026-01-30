import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const getCoinHistory = async (coinId = 'bitcoin', days = 30) => {
    try {
        const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}/market_chart`, {
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
        console.error(`Error fetching ${coinId} history:`, error);
        return [];
    }
};
