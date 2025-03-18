import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rating } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import './Feedback.css'
import Swal from 'sweetalert2';

const Feedback = () => {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [selectedRating, setSelectedRating] = useState(5); // Default to show 5-star feedbacks
  const [showDropdown, setShowDropdown] = useState(false); // For mobile-friendly dropdown

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5: return "#4caf50"; // Green for excellent
      case 4: return "#2196f3"; // Blue for good
      case 3: return "#ffeb3b"; // Yellow for average
      case 2: return "#ff9800"; // Orange for below average
      case 1: return "#f44336"; // Red for poor
      default: return "#8884d8"; // Default color
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feedback`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setFeedbacks(response.data);
    } catch (err) {
      setError("Failed to fetch feedbacks.");
    }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/feedback`,
      { rating, comment },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
      if (response.status === 201) {
        setComment("");
        setRating(4);
        fetchFeedbacks();
        Swal.fire({
          title: 'Thank you!',
          text: 'Your feedback has been submitted successfully',
          icon: 'success',
          confirmButtonColor: '#4caf50',
          background: '#f8f9fa',
          backdrop: `rgba(0,0,0,0.4)`,
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        Swal.fire({
          title: 'Oops!',
          text: 'Failed to submit feedback. Please try again.',
          icon: 'error',
          confirmButtonColor: '#f44336'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while submitting feedback.',
        icon: 'error',
        confirmButtonColor: '#f44336'
      });
    }
  };

  const getRatingCounts = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((feedback) => {
      counts[feedback.rating]++;
    });
    return Object.entries(counts).map(([key, value]) => ({
      rating: key,
      count: value,
    }));
  };

  const ratingCounts = getRatingCounts();

  const filteredFeedbacks = feedbacks
    .filter((feedback) => feedback.rating === selectedRating)
    .sort((a, b) => new Date(b.date) - new Date(a.date));



  return (
    <div className="feedback-page">
      {/* Feedback Form */}
      <div className="feedback-container">
        <h1>How would you rate us:</h1>
        <div className="rating-section">
          <Rating
            name="rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            size="large"
            sx={{ fontSize: 100 }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="comment">Give us your Feedback:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback here..."
            required
          ></textarea>
          <button type="submit">Submit Feedback</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Feedback Display Section */}
      <div className="feedback-display">
        <h2>Our Trusted Client Feedback</h2>
        <div className="rating-selector">
          <button onClick={() => setShowDropdown(!showDropdown)}>
            {selectedRating} Star{selectedRating !== 1 ? "s" : ""} ▼
          </button>
          {showDropdown && (
            <div className="rating-dropdown">
              {[5, 4, 3, 2, 1].map((star) => (
                <div
                  key={star}
                  className="rating-option"
                  onClick={() => {
                    setSelectedRating(star);
                    setShowDropdown(false);
                  }}
                >
                  {star} Star{star !== 1 ? "s" : ""}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="feedback-list-container">
          {filteredFeedbacks.length === 0 ? (
            <p>No feedback yet for {selectedRating} star{selectedRating !== 1 ? "s" : ""}.</p>
          ) : (
            <div className="feedback-list">
              {filteredFeedbacks.map((feedback, index) => (
                <div key={index} className="feedback-item">
                  <p className="feedback-comment">"{feedback.comment}"</p>
                  <Rating value={feedback.rating} readOnly size="small" />
                  <div className="feedback-profile">
                    <div className="profile-avatar"></div>
                    <div>
                      <p className="profile-name">{feedback.name || "Anonymous"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Rating Analysis */}
      <div className="feedback-analysis" style={{
        padding: "40px",
        borderRadius: "20px",
        backgroundColor: "#1e2746",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        margin: "30px 0",
        border: "1px solid rgba(0,0,0,0.05)",
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#ffffff",
          fontSize: "28px",
          fontWeight: "600",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
        }}>Feedback Rating Analysis</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={ratingCounts}
            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="rating"
              tick={{ fill: "#ffffff", fontSize: 14, fontWeight: "500" }}
              label={{
                value: "Rating Stars",
                position: "bottom",
                offset: 15,
                fill: "#ffffff",
                fontSize: 16,
                fontWeight: "bold"
              }}
            />
            <YAxis
              tick={{ fill: "#ffffff", fontSize: 14, fontWeight: "500" }}
              label={{
                value: "Number of Reviews",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                fill: "#ffffff",
                fontSize: 16,
                fontWeight: "bold"
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                padding: "12px"
              }}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                paddingBottom: "20px",
                fontSize: "16px",
                fontWeight: "500"
              }}
            />
            <Bar
              dataKey="count"
              name="Total Reviews"
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
            >
              {ratingCounts.map((entry) => (
                <Cell
                  key={`cell-${entry.rating}`}
                  fill={getRatingColor(parseInt(entry.rating))}
                  style={{
                    filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))"
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Feedback;
