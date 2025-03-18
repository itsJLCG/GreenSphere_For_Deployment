import React, { useState, useEffect } from "react";
import { energyTechnologies } from "./Data";

const ResourceEffects = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Add effect to handle body scroll
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleCardClick = (index) => {
    if (comparisonMode) {
      if (selectedItems.includes(index)) {
        setSelectedItems(selectedItems.filter(item => item !== index));
        setShowModal(false);
      } else if (selectedItems.length < 2) {
        const newSelected = [...selectedItems, index];
        setSelectedItems(newSelected);
        if (newSelected.length === 2) {
          setShowModal(true);
        }
      }
    } else {
      setActiveIndex(activeIndex === index ? null : index);
    }
  };

  const technologies = Object.entries(energyTechnologies).slice(0, 9);

  const calculateEfficiencyScore = (tech) => {
    const costScore = tech.costEfficiency === "High" ? 3 : tech.costEfficiency === "Moderate" ? 2 : 1;
    const envScore = tech.environmentalImpact === "Low" ? 3 : tech.environmentalImpact === "Moderate" ? 2 : 1;
    return ((costScore + envScore) / 6) * 100;
  };

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Resource Effects Analysis</h2>
        <button
          className="mode-toggle"
          onClick={() => {
            setComparisonMode(!comparisonMode);
            setSelectedItems([]);
          }}
        >
          {comparisonMode ? '🔍 Detail View' : '⚖️ Compare'}
        </button>
      </div>

      <div className="main-content">
        <div className="grid">
          {technologies.map(([name, details], index) => (
            <div
              key={index}
              className={`card ${activeIndex === index ? "active" : ""} 
                        ${selectedItems.includes(index) ? "selected" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-header">
                <img src={details.image} alt={name} />
                <h3>{name}</h3>
              </div>
              <div className="details">
                <div className="metric-bar">
                  <div className="metric-header">
                    <label>Energy Output</label>
                    <span className="value">{details.energyOutput}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${details.energyOutput.includes('kWh') ?
                          parseInt(details.energyOutput) / 50 : 50}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="metric-bar">
                  <div className="metric-header">
                    <label>Cost Efficiency</label>
                    <span className="value">{details.costEfficiency}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${details.costEfficiency === "High" ? 90 :
                          details.costEfficiency === "Moderate" ? 60 : 30}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="metric-bar">
                  <div className="metric-header">
                    <label>Environmental Impact</label>
                    <span className="value">{details.environmentalImpact}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${details.environmentalImpact === "Low" ? 90 :
                          details.environmentalImpact === "Moderate" ? 60 : 30}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="metric-bar">
                  <div className="metric-header">
                    <label>Product Cost</label>
                    <span className="value">₱{details.productCost.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${Math.min(details.productCost / 300000 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="metric-bar">
                  <div className="metric-header">
                    <label>Installation Cost</label>
                    <span className="value">₱{details.installation.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${Math.min(details.installation / 300000 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="metric-bar">
                  <div className="metric-header">
                    <label>Maintenance Cost</label>
                    <span className="value">₱{details.maintenance.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${Math.min(details.maintenance / 50000 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="metric-bar">
                  <div className="metric-header">
                    <label>Carbon Emissions</label>
                    <span className="value">{details.carbonEmissions} kg CO₂</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${Math.min(details.carbonEmissions / 50 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="metric-bar">
                  <div className="metric-header">
                    <label>Electricity Cost</label>
                    <span className="value">
                      {details.electricityCost !== "N/A" ? `₱${details.electricityCost}/kWh` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Updated Modal Component */}
      {showModal && selectedItems.length === 2 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            <div className="modal-header">
              <h3 className="modal-title">Technology Comparison</h3>
              <p className="modal-subtitle">Analyzing efficiency and performance metrics</p>
            </div>

            <div className="comparison-container">
              <div className="tech-column">
                <div className="tech-header">
                  <img
                    src={technologies[selectedItems[0]][1].image}
                    alt={technologies[selectedItems[0]][0]}
                    className="tech-image"
                  />
                  <h4>{technologies[selectedItems[0]][0]}</h4>
                </div>
                <div className="metrics">
                  {[
                    { label: "Energy Output", key: "energyOutput", divisor: 50, isText: true },
                    { label: "Cost Efficiency", key: "costEfficiency", options: { High: 90, Moderate: 60, Low: 30 } },
                    { label: "Environmental Impact", key: "environmentalImpact", options: { Low: 90, Moderate: 60, High: 30 } },
                    { label: "Product Cost", key: "productCost", prefix: "₱", divisor: 300000 },
                    { label: "Installation Cost", key: "installation", prefix: "₱", divisor: 300000 },
                    { label: "Maintenance Cost", key: "maintenance", prefix: "₱", divisor: 50000 },
                    { label: "Carbon Emissions", key: "carbonEmissions", suffix: " kg CO₂", divisor: 50 },
                    { label: "Electricity Cost", key: "electricityCost", prefix: "₱", suffix: "/kWh", isText: true }
                  ].map(({ label, key, divisor, prefix = "", suffix = "", options, isText }) => (
                    <div key={key} className="metric">
                      <label>{label}</label>
                      <div className="bar-container">
                        {options ? (
                          <div className="bar" style={{ width: `${options[technologies[selectedItems[0]][1][key]] || 30}%` }}></div>
                        ) : divisor ? (
                          <div className="bar" style={{ width: `${Math.min((parseInt(technologies[selectedItems[0]][1][key]) || 0) / divisor * 100, 100)}%` }}></div>
                        ) : null}
                        <span>
                          {prefix}
                          {isText ? technologies[selectedItems[0]][1][key] : technologies[selectedItems[0]][1][key].toLocaleString()}
                          {suffix}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VS Divider Placed Between the Two Columns */}
              <div className="vs-divider">
                <span className="vs-circle">VS</span>
              </div>

              <div className="tech-column">
                <div className="tech-header">
                  <img
                    src={technologies[selectedItems[1]][1].image}
                    alt={technologies[selectedItems[1]][0]}
                    className="tech-image"
                  />
                  <h4>{technologies[selectedItems[1]][0]}</h4>
                </div>
                <div className="metrics">
                  {[
                    { label: "Energy Output", key: "energyOutput", divisor: 50, isText: true },
                    { label: "Cost Efficiency", key: "costEfficiency", options: { High: 90, Moderate: 60, Low: 30 } },
                    { label: "Environmental Impact", key: "environmentalImpact", options: { Low: 90, Moderate: 60, High: 30 } },
                    { label: "Product Cost", key: "productCost", prefix: "₱", divisor: 300000 },
                    { label: "Installation Cost", key: "installation", prefix: "₱", divisor: 300000 },
                    { label: "Maintenance Cost", key: "maintenance", prefix: "₱", divisor: 50000 },
                    { label: "Carbon Emissions", key: "carbonEmissions", suffix: " kg CO₂", divisor: 50 },
                    { label: "Electricity Cost", key: "electricityCost", prefix: "₱", suffix: "/kWh", isText: true }
                  ].map(({ label, key, divisor, prefix = "", suffix = "", options, isText }) => (
                    <div key={key} className="metric">
                      <label>{label}</label>
                      <div className="bar-container">
                        {options ? (
                          <div className="bar" style={{ width: `${options[technologies[selectedItems[1]][1][key]] || 30}%` }}></div>
                        ) : divisor ? (
                          <div className="bar" style={{ width: `${Math.min((parseInt(technologies[selectedItems[1]][1][key]) || 0) / divisor * 100, 100)}%` }}></div>
                        ) : null}
                        <span>
                          {prefix}
                          {isText ? technologies[selectedItems[1]][1][key] : technologies[selectedItems[1]][1][key].toLocaleString()}
                          {suffix}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          height: 100vh;
          padding: 0.5rem;
          color: white;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding
        }

        .title {
          font-size: 2rem;  /* reduced from 2.5rem */
          font-weight: 800;
          text-align: center;
          margin-bottom: 0.15rem;  /* reduced from 0.25rem */
          background: linear-gradient(45deg, #4CAF50, #8BC34A, #4CAF50);
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        @keyframes gradient {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.35rem;  /* reduced from 0.5rem */
          padding: 0.15rem;  /* reduced from 0.25rem */
          margin-top: -0.25rem; /* Added negative top margin */
        }

        .card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.25);
          border-color: rgba(76, 175, 80, 0.4);
        }

        .card.active {
          border-color: rgba(76, 175, 80, 0.5);
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
        }

        .card img {
          width: 4rem;  /* reduced from 5rem */
          height: 4rem;  /* reduced from 5rem */
          object-fit: cover;
          margin-bottom: 0.5rem;  /* reduced from 0.75rem */
          border-radius: 0.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.4s ease;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
        }

        .card:hover img {
          transform: scale(1.12) translateY(-2px);
          filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.3));
        }

        .card h3 {
          font-size: 1rem; /* reduced from 1.15rem */
          font-weight: 700;
          margin-bottom: 0.25rem; /* reduced from 0.5rem */
          color: #4CAF50;
          transition: color 0.3s ease;
        }

       .card {
          padding: 0.75rem;
          background: linear-gradient(165deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.98));
          border-radius: 0.75rem;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(76, 175, 80, 0.15);
          position: relative; /* Needed for z-index stacking */
          overflow: visible; /* Allows child elements to expand outside */
          z-index: 1; /* Default, will increase when active */
        }

.details {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  width: 100%;
  transform: translateY(5px);
  background: rgba(45, 55, 72, 0.98);
  border-radius: 0.5rem;
  padding: 0;
  position: absolute;
  top: 0; /* Cover the card */
  left: 0;
  z-index: -1;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  transition: max-height 0.4s ease, opacity 0.4s ease, z-index 0s 0.4s;

  /* Grid Layout */
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.card.active {
  z-index: 10;
}

.card.active .details {
  max-height: 250px; /* Adjust based on content */
  opacity: 1;
  padding: 1rem;
  z-index: 10;
  max-width: 500px; /* Limit width of expanded details */
  overflow-x: auto; /* Enable horizontal scroll */
  overflow-y: auto;
  white-space: nowrap; /* Prevent wrapping */
  transition: max-height 0.4s ease, opacity 0.4s ease, z-index 0s;
}

/* Responsive Fixes */
@media (max-width: 900px) {
  .details {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    max-width: 100%; /* Allow it to shrink */
  }
}



        .card p {
          margin: 0.25rem 0; /* reduced from 0.4rem */
          font-size: 0.85rem; /* reduced from 0.9rem */
          line-height: 1.2; /* reduced from 1.3 */
          color: rgba(255, 255, 255, 0.9);
        }

        .card p strong {
          background: linear-gradient(90deg, #4CAF50, #8BC34A);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          margin-right: 0.5rem;
        }

        @media (max-width: 768px) {
          .container {
            max-width: 100%;
            padding: 1rem;
          }
          
          .grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
          }
          
          .title {
            font-size: 2rem;
          }

          .card {
            padding: 1rem;
          }
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .mode-toggle {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #4CAF50, #45a049);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .mode-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .card.selected {
          border: 2px solid #4CAF50;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .metric-bar {
          width: 100%;
          margin: 0.75rem 0;
        }

        .metric-bar label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #45a049);
          transition: width 0.4s ease;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease;
          overflow: hidden; /* Prevent overlay scroll */
        }

        .modal-content {
          background: linear-gradient(165deg, rgba(45, 55, 72, 0.98), rgba(26, 32, 44, 0.95));
          border-radius: 20px;
          padding: 2.5rem;
          width: 90%;
          max-width: 1000px;
          max-height: 85vh; /* Reduced from 90vh */
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(76, 175, 80, 0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.4s ease;
          margin: 2rem; /* Add margin to ensure modal doesn't touch screen edges */
          
          /* Add custom scrollbar styling */
          scrollbar-width: thin;
          scrollbar-color: rgba(76, 175, 80, 0.5) rgba(255, 255, 255, 0.1);
        }

        /* Custom scrollbar styles for WebKit browsers */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(76, 175, 80, 0.5);
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(76, 175, 80, 0.7);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .modal-title {
          font-size: 2rem;
          color: #4CAF50;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }

        .modal-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
        }

        .close-button {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }

        .comparison-container {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 3rem;
          padding: 1rem;
        }

        .tech-column {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tech-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .tech-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 16px;
          margin-bottom: 1rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(76, 175, 80, 0.3);
        }

        .vs-divider {
          display: flex;
          align-items: center;
          color: #4CAF50;
        }

        .vs-circle {
          width: 60px;
          height: 60px;
          background: rgba(76, 175, 80, 0.1);
          border: 2px solid rgba(76, 175, 80, 0.3);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #4CAF50;
        }

        .metrics {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .metric {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 1rem;
        }

        .metric label {
          display: block;
          margin-bottom: 0.75rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .bar-container {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          position: relative;
        }

        .bar {
          height: 8px;
          background: linear-gradient(90deg, #4CAF50, #45a049);
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .modal-content {
            padding: 1.5rem;
            margin: 1rem;
            max-height: 80vh;
          }
        }
      `}</style>
    </div>
  );
};

export default ResourceEffects;