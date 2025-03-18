import React, { useState, useEffect } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const CarbonFootprint = () => {
  const [carbonData, setCarbonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aggregatedData, setAggregatedData] = useState({
    averageCarbonPaybackPeriod: 0,
    totalCarbonEmission: 0,
  });

  useEffect(() => {
    const fetchCarbonData = async () => {
      try {
        // Fetch data from your API
        const response = await axios.get('http://localhost:3001/admin/carbon-payback');
        setCarbonData(response.data);

        // Calculate aggregated data
        const totalPayback = response.data.reduce((sum, user) => sum + user.CarbonPaybackPeriod, 0);
        const totalEmission = response.data.reduce((sum, user) => sum + user.TotalCarbonEmission, 0);

        setAggregatedData({
          averageCarbonPaybackPeriod: totalPayback / response.data.length,
          totalCarbonEmission: totalEmission,
        });
      } catch (error) {
        console.error("Error fetching carbon data:", error);
        setError("Failed to fetch carbon data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarbonData();
  }, []);

  const getChartData = (value, maxValue) => ({
    datasets: [{
      data: [value, maxValue - value],
      backgroundColor: [
        'rgba(76, 175, 80, 0.9)', // Green color
        'rgba(76, 175, 80, 0.1)'  // Light green for remaining
      ],
      borderWidth: 0,
      cutout: '75%'
    }],
    labels: ['Value', 'Remaining']
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container">{error}</div>;
  }

  if (!carbonData.length) {
    return <div className="container">No data available.</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Carbon Footprint Analysis</h2>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: "linear-gradient(135deg, #FFB75E, #ED8F03)" }}>
          <div className="stat-content">
            <h3>Average Carbon Payback Period</h3>
            <div className="chart-container">
              <Doughnut data={getChartData(aggregatedData.averageCarbonPaybackPeriod, 1)} options={chartOptions} />
              <div className="stat-overlay">
                <p className="stat-value">{aggregatedData.averageCarbonPaybackPeriod.toFixed(2)}</p>
                <p className="stat-label">years</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, #48c6ef, #6f86d6)" }}>
          <div className="stat-content">
            <h3>Total Carbon Emission</h3>
            <div className="chart-container">
              <Doughnut data={getChartData(aggregatedData.totalCarbonEmission, 1000)} options={chartOptions} />
              <div className="stat-overlay">
                <p className="stat-value">{aggregatedData.totalCarbonEmission.toFixed(2)}</p>
                <p className="stat-label">tons</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section" style={{ borderColor: "#80D0C7" }}>
        <h3>Impact Analysis</h3>
        <p>
          On average, the carbon payback period is {aggregatedData.averageCarbonPaybackPeriod.toFixed(2)} years, and the total carbon emission across all users is {aggregatedData.totalCarbonEmission.toFixed(2)} tons.
          This analysis helps understand the overall environmental impact and the collective effort required to offset the carbon footprint.
        </p>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          color: white;
          background: linear-gradient(165deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.98));
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          height: 100vh;
          overflow-y: auto;
        }

        .title {
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #4CAF50, #8BC34A);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          position: relative;
          padding: 1rem;
          border-radius: 16px;
          text-align: center;
          overflow: hidden;
          transition: all 0.4s ease;
          min-height: 250px;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .stat-content {
          position: relative;
          z-index: 1;
        }

        .stat-card h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: white;
        }

        .stat-value {
          font-size: 3rem;
          font-weight: bold;
          color: white;
          margin: 0.5rem 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .stat-label {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .info-section {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 16px;
          border: 2px solid;
          backdrop-filter: blur(8px);
          transition: all 0.4s ease;
        }

        .info-section:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .info-section h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: white;
        }

        .info-section p {
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }

        .chart-container {
          position: relative;
          height: 200px;
          width: 100%;
        }

        .stat-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .title {
            font-size: 2rem;
          }

          .stat-value {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CarbonFootprint;