import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="page-container hero-section">
            <h1 className="hero-title">
                Visualizing the Future of <span className="gradient-text">Finance</span>
            </h1>
            <p className="hero-subtitle">
                Explore real-time cryptocurrency trends with our beautiful, interactive D3.js visualizations.
            </p>
            <Link to="/dashboard" className="cta-button">
                Go to Dashboard
            </Link>
        </div>
    );
};

export default Home;
