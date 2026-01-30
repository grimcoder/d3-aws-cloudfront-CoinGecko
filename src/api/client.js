import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCoinHistory = async (coinId = 'bitcoin', days = 30) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history`, {
            params: {
                coinId: coinId,
                days: days
            }
        });

        // The API returns the raw CoinGecko response structure { prices: [[timestamp, price], ...] }
        // Or depending on implementation, check if we need to adjust parsing.
        // My lambda returns `JSON.stringify(data)` where `data` is the parsed CoinGecko response.
        // So `response.data` is the object with `prices` array.

        return response.data.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp),
            price: price
        }));
    } catch (error) {
        console.error(`Error fetching ${coinId} history:`, error);
        return [];
    }
};
