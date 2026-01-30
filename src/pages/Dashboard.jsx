import { useState, useEffect } from 'react';
import CryptoLineChart from '../components/CryptoLineChart';
import { getBitcoinHistory } from '../api/client';
import '../components/CryptoLineChart.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const history = await getBitcoinHistory(90); // 90 days
            setData(history);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="page-container">
            <h2 className="section-title">Bitcoin Price History (90 Days)</h2>
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
