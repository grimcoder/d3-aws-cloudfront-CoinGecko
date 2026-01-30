import { useState, useEffect } from 'react';
import CryptoLineChart from '../components/CryptoLineChart';
import { getBitcoinHistory } from '../api/client';
import '../components/CryptoLineChart.css';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(90);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const history = await getBitcoinHistory(days);
            setData(history);
            setLoading(false);
        };

        fetchData();
    }, [days]);

    return (
        <div className="page-container">
            <h2 className="section-title">Bitcoin Price History</h2>

            <div className="controls-container">
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
