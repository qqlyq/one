import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const ActivityModal = ({ show, onClose, lat, long, query, onSelectActivity }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      fetchActivities();
    }
  }, [show]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://citygetaway-backend-api.vercel.app/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: [lat, long],
          query: query,
          radius: 3000,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch activities");

      const data = await response.json();
      setActivities(data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select a New Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <>
            <h2 className="loading-text fade-in">Generating your AI-powered itinerary...</h2>
            <p className="loading-subtext">
              Powered by <span className="ai-highlight">Concord AI 🤖</span>
            </p>
          </>
        ) : activities.length === 0 ? (
          <p>No activities found.</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="activity-option">
              <h5>{activity.name}</h5>
              <p>⭐ Rating: {activity.rating || "N/A"}</p>
              <p>💰 Price Level: {activity.price_level !== null ? activity.price_level : "N/A"}</p>
              <Button
                variant="success"
                size="sm"
                onClick={() => onSelectActivity(activity)}
              >
                Select
              </Button>
              <hr />
            </div>
          ))
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ActivityModal;
