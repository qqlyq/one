import React, { useState, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/BudgetTiers.css";


const BudgetTiers = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  // const { preferences, updatePreferences} = useContext(UserPreferencesContext);
  const navigate = useNavigate();

  const tiers = [
    {
      title: "Basic Tier",
      plan: "Basic",
      activities: [
        { time: "Check-in", description: "Arrive at Hotel Chrome Montreal", price: "Free" },
        { time: "Sightseeing", description: "Explore Old Montreal", price: "$10" },
        { time: "Dinner", description: "Casual dining at Garde Manger", price: "$40" },
        { time: "Morning Hike", description: "Hike Mont Royal", price: "Free" },
        { time: "Cultural Visit", description: "Montreal Museum of Fine Arts", price: "$25" },
      ],
      totalPrice: "$1499",
    },
    {
      title: "Signature Tier",
      plan: "Signature",
      activities: [
        { time: "Check-in", description: "Arrive at Hotel Bonaventure Montreal" },
        { time: "Evening", description: "Wander through Old Montreal" },
        { time: "Dinner", description: "Enjoy dinner at Modavie" },
        { time: "Museum Visit", description: "Explore Museum of Fine Arts" },
        { time: "Afternoon Fun", description: "Visit La Ronde Amusement Park" },
      ],
      totalPrice: "$2499",
    },
    {
      title: "Luxury Tier",
      plan: "Luxury",
      activities: [
        { time: "Check-in", description: "Arrive at The Ritz-Carlton, Montreal" },
        { time: "Luxury Dinner", description: "Dine at Maison Boulud" },
        { time: "Gourmet Dinner", description: "Dinner at Le Club Chasse" },
        { time: "Evening", description: "Relaxing on the St. Lawrence River" },
        { time: "Gourmet Dinner", description: "Dine at Toqué!" },
      ],
      totalPrice: "$3499",
    },
  ];

  // Handle tier selection → Open modal
  const handleSelect = (tier) => {
    setSelectedTier(tier);
    setShowModal(true);
    // navigate(`/day/1`);
    // updatePreferences({selectedTier: tier}); // Update user preferences in context
    const defaultPreferences = []; // or provide a default structure if needed
  handleModalSubmit(tier, defaultPreferences);
  };

  // Handle modal submit → Show loading screen, fetch itinerary, and navigate
  const handleModalSubmit = (tier,preferences) => {
    setShowModal(false);
    setSelectedPreferences(preferences);
    setLoading(true); // Show loading screen

  // Simulate AI processing delay
  };

  return (
    <>
       (
        <div className="budget-tiers">
          <Container style={{ padding: "40px 0" }}>
            <h2 className="text-center mb-4">Discover Your Perfect Getaway: Choose Your Ideal Experience!</h2>
            <Row className="budget-tiers-row">
              {tiers.map((tier, index) => (
                <Col md={4} key={index}>
                  <Card className="mb-4 h-100">
                    <Card.Body>
                      <Card.Title className="text-center">
                        <strong>{tier.title}</strong>
                      </Card.Title>
                      <ul className="budget-tiers-list">
                        {tier.activities.map((activity, idx) => (
                          <li key={idx}>
                            <strong>{activity.time}:</strong> {activity.description}
                          </li>
                        ))}
                        <li style={{ textAlign: "center" }}>
                          <strong>Total Price:</strong> {tier.totalPrice}
                        </li>
                      </ul>
                      <div className="text-center">
                        <Button
                          variant="primary"
                          onClick={() => handleSelect(tier)}
                        >
                          Select
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>

          {/* Itinerary Preference Modal */}
          {/* <ItineraryPreferenceModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            handleSubmit={handleModalSubmit}
          /> */}
        </div>
      )}
    </>
  );
};

export default BudgetTiers;
