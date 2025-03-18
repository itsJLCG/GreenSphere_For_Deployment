import React, { useState, useEffect } from "react";
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EnergyPromoting = () => {
  const [energyData, setEnergyData] = useState([]);
  const [selectedEnergy, setSelectedEnergy] = useState("Wind Energy");

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/renewable-energy`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setEnergyData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEnergyData();
  }, []);

  const handleEnergySelect = (source) => {
    setSelectedEnergy(source);
  };

  const selectedData = energyData.find(data => data.source === selectedEnergy);

  const chartData = {
    labels: energyData.map(data => data.source),
    datasets: [
      {
        label: 'Total Used',
        data: energyData.map(data => data.totalUsed),
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: '#4CAF50',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Renewable Energy Usage',
      },
    },
  };

  return (
    <div className="container">
      <h1 className="title">Renewable Energy Analysis</h1>
      <div className="energy-selector">
        {energyData.map((data) => (
          <button
            key={data.source}
            className={`energy-btn ${selectedEnergy === data.source ? 'active' : ''}`}
            onClick={() => handleEnergySelect(data.source)}
          >
            {data.source}
          </button>
        ))}
      </div>
      <div className="analysis-grid">
        <div className="chart-card">
          <h3>Energy Usage Overview</h3>
          <Bar data={chartData} options={options} />
        </div>
        <div className="chart-card">
          <h3>Selected Energy Details</h3>
          {selectedData && (
            <div className="energy-details">
              <div className="energy-info">
                <div className="energy-tag">
                  <span>Source</span>
                  <span className="energy-value">{selectedData.source}</span>
                </div>
                <div className="energy-tag">
                  <span>Total Used</span>
                  <span className="energy-value">{selectedData.totalUsed} units</span>
                </div>
              </div>
              <div className="energy-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(selectedData.totalUsed / 3000) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-label">
                  {((selectedData.totalUsed / 3000) * 100).toFixed(2)}% of total capacity
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="info-card">
          <h3>Total Per Renewable Source Analysis</h3>
          <div className="cost-benefit">
            {energyData.map((data) => (
              <div key={data.source} className="cost-item">
                <span>{data.source}</span>
                <span>{data.totalUsed}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
          background: linear-gradient(165deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.98));
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          height: 100vh;
          overflow-y: auto;
          position: relative;
        }

        .container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at top right, rgba(76, 175, 80, 0.1), transparent 60%),
                      radial-gradient(circle at bottom left, rgba(139, 195, 74, 0.1), transparent 60%);
          border-radius: 20px;
          pointer-events: none;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(45deg, #4CAF50, #8BC34A, #4CAF50);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .energy-selector {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .energy-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .energy-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: 0.5s;
        }

        .energy-btn:hover::before {
          left: 100%;
        }

        .energy-btn.active {
          background: rgba(76, 175, 80, 0.2);
          border-color: #4CAF50;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(76, 175, 80, 0.2);
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-top: 1rem;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .chart-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(76, 175, 80, 0.2);
          border-color: rgba(76, 175, 80, 0.3);
        }

        .chart-card h3 {
          margin-bottom: 1.5rem;
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          position: relative;
          padding-left: 1rem;
        }

        .chart-card h3::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: #4CAF50;
          border-radius: 2px;
        }

        .info-card {
          grid-column: span 2;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(76, 175, 80, 0.2);
          backdrop-filter: blur(12px);
        }

        .tag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .tag {
          background: rgba(76, 175, 80, 0.15);
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          border: 1px solid rgba(76, 175, 80, 0.3);
          transition: all 0.3s ease;
          font-size: 0.9rem;
          backdrop-filter: blur(4px);
        }

        .tag:hover {
          background: rgba(76, 175, 80, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
        }

        .cost-benefit {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .cost-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(76, 175, 80, 0.2);
          transition: all 0.3s ease;
        }

        .cost-item:hover {
          background: rgba(76, 175, 80, 0.1);
          transform: translateY(-2px);
        }

        .cost-item span:first-child {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .cost-item span:last-child {
          font-size: 1.2rem;
          font-weight: 600;
          color: #4CAF50;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1.5rem;
          }

          .analysis-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .info-card {
            grid-column: span 1;
          }

          .title {
            font-size: 2rem;
          }

          .energy-selector {
            flex-direction: column;
            gap: 1rem;
          }
        }.energy-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.energy-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.energy-tag {
  background: rgba(76, 175, 80, 0.15);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  flex: 1;
  min-width: 150px;
  text-align: center;
}

.energy-tag span {
  display: block;
}

.energy-tag span:first-child {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
}

.energy-tag .energy-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4CAF50;
}

.energy-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
}
      `}</style>
    </div>
  );
};

export default EnergyPromoting;