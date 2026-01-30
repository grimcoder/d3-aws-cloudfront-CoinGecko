import { useState, useEffect } from 'react';
import CryptoLineChart from '../components/CryptoLineChart';
import { getCoinHistory } from '../api/client';
import '../components/CryptoLineChart.css';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(90);
    const [coin, setCoin] = useState('bitcoin');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const history = await getCoinHistory(coin, days);
            setData(history);
            setLoading(false);
        };

        fetchData();
    }, [days, coin]);

    return (
        <div className="page-container">
            <h2 className="section-title">{coin.charAt(0).toUpperCase() + coin.slice(1)} Price History</h2>

            <div className="controls-container">
                <div className="button-group">
                    <button
                        className={`range-button ${coin === 'bitcoin' ? 'active' : ''}`}
                        onClick={() => setCoin('bitcoin')}>Bitcoin</button>
                    <button
                        className={`range-button ${coin === 'ethereum' ? 'active' : ''}`}
                        onClick={() => setCoin('ethereum')}>Ethereum</button>
                    <button
                        className={`range-button ${coin === 'solana' ? 'active' : ''}`}
                        onClick={() => setCoin('solana')}>Solana</button>
                    <button
                        className={`range-button ${coin === 'dogecoin' ? 'active' : ''}`}
                        onClick={() => setCoin('dogecoin')}>Dogecoin</button>
                </div>

                <div className="diver" style={{ width: '2px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 1rem' }}></div>

                <div className="button-group">
                    <button
                        className={`range-button ${days === 7 ? 'active' : ''}`}
                        onClick={() => setDays(7)}>7D</button>
                    <button
                        className={`range-button ${days === 30 ? 'active' : ''}`}
                        onClick={() => setDays(30)}>1M</button>
                    <button
                        className={`range-button ${days === 90 ? 'active' : ''}`}
                        onClick={() => setDays(90)}>3M</button>
                    <button
                        className={`range-button ${days === 365 ? 'active' : ''}`}
                        onClick={() => setDays(365)}>1Y</button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading Data...</div>
            ) : (
                <div className="chart-container">
                    <CryptoLineChart data={data} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
