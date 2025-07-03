import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Dropdown } from "react-bootstrap";
import ActivityModal from "../../_modals/ActivityModal";
// import LateNightModal from "../../_modals/specific/LateActivityModal";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { GeoAltFill } from "react-bootstrap-icons";
import "../../styles/FirstDay.css";
import {ActivitiesContext} from "../../context/ActivitiesContext";
import TravelMapModal from "../../_modals/specific/TravelMapModal";
import { useEffect } from "react";
import {changeActivity} from "../../_utils/api";





const ActivityCard = ({ data, isExpanded, onToggle, isNew, isRemoved, isGenerated, setModalType, setModalData, setShowModal }) => {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [localData, setLocalData] = useState(data);
  const [isGeneratedAPI, setIsGeneratedAPI] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [travelMode, setTravelMode] = useState("driving");
  const location = useLocation();

  // console.log(data)


  const navigate = useNavigate()
    const { setRemovedActivities, changeAllActivities, planId, activities } = useContext(ActivitiesContext);
    const matchingPlanItem = (activities ?? [])
  .flatMap(activity => activity.plan ?? [])
  .find(planItem => String(planItem.place_id) === String(data.place_id));
const rawPriceLevel = matchingPlanItem?.price_level;
const level = Number(rawPriceLevel);

const priceLevel =
  level === 0 ? "Free" :
  level === 1 ? "$10" :
  level === 2 ? "$20" :
  level === 3 ? "$30" :
  level === 4 ? "$40" :
  "N/A";




  useEffect(() => {
    const fetchLatLng = async () => {
      if (!localData.place_id) return;

      try {
        const response = await fetch(`https://citygetaway-backend-plan-service.vercel.app/api/place_lat_lng?place_id=${localData.place_id}`, {
          headers: {
            "X-User-Name": "testDan",
            "X-User-Id": "681a6db71771cb427864f564",
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLocalData(prev => ({
            ...prev,
            lat: data.lat,
            long: data.lng,
          }));
        } else {
          console.warn("Could not fetch lat/lng for place_id:", localData.place_id);
        }
      } catch (err) {
        console.error("Error fetching lat/lng:", err.message || err);
      }
    };

    fetchLatLng();
  }, [localData.place_id]);


  const originLat=45.508175843784336; // Hotel latitude
  const originLng=-73.5617505630567;    // Hotel longitude
  const lat = localData.lat || 45.5017; // Default to Montreal latitude
  const long = localData.long || -73.5673; // Default to Montreal longitude
  const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${originLat},${originLng}&destination=${lat},${long}&mode=${travelMode}`;
  const query =
    localData.category === "Breakfast" || localData.category === "Lunch" || localData.category === "Dining Experience"
      ? "restaurant"
      : "tourist_attractions";

  const handleSelectActivity = (newActivity) => {
    const updatedActivity = { ...newActivity };
    setIsGeneratedAPI(true);
    setLocalData(updatedActivity);
    setShowActivityModal(false);
  };
  // console.log(localData)

  const requestBody = {
      "budget": 500,
      "day_index": data.day_index,
      "end_time": data.end_time,
      "hotel_location": [
          45.4959,
          -73.6206
      ],
      "location": [
          45.4959,
          -73.6206
      ],
      "max_travel_time": 45,
      "plan_id": planId,
      "place_id": localData.place_id,
      "preferences": [
          "Shopping",
          "Sightseeing"
      ],
      "radius": 2500,
      "replace_activities": [
          localData.name,
      ],
      "start_time": data.start_time,
      "multi_day_itinerary": activities,
  }
  // console.log(activities)


  const handleChangeActivity = async () => {
    const response = await changeActivity(requestBody);
    if (response) {
        setModalData(response);
        setModalType("lateItinerary");
        setShowModal(true);
    } else {
      console.error("Failed to fetch activities");
    }
  }

  
  return (
    <>
      <Card
        onClick={onToggle}
        className={`custom-card ${isNew ? "new-activity" : ""} ${isRemoved ? "removed-activity" : ""}`}
        style={{
          marginBottom: "15px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <Card.Body>
          {/* Status Badges */}
          {isNew && <span className="new-badge">NEW</span>}
          {isRemoved && <span className="removed-badge">REMOVED</span>}

          


          <div style={{ display: "flex", gap: "15px" }}>
            {/* Render image if available */}
            {localData.image && (
              <img
                src={localData.image}
                alt={localData.name || "Activity Image"}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/logocity.jpg";
                }}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%",paddingRight: "50px" }}>
            <div style={{ flex: "1 1 auto" }}>
              <h5 className="card-title" style={{ margin: 0 }}>{localData.name}</h5>
                <p className="card-details" style={{ margin: "5px 0", fontSize: "0.9rem" }}>
                  ⏱️ <strong>{localData.duration || "N/A"}</strong>
                  {/* <br /> */}
                  {/* 💰 <strong>{priceLevel}</strong> */}
                  

                  {/* <br /> */}
                  <div style={{ marginTop: "5px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <GeoAltFill
                      size={20}
                      style={{ color: "#007bff", cursor: "pointer" }}
                      title="Show Directions"
                      onClick={() => setShowMapModal(true)}
                    />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label htmlFor="travelMode" style={{ fontSize: "0.8rem", fontWeight: "500" }}>Travel Mode:</label>
                      <select
                        id="travelMode"
                        value={travelMode}
                        onChange={(e) => setTravelMode(e.target.value)}
                        style={{ padding: "4px", borderRadius: "5px", fontSize: "0.8rem" }}
                      >
                        <option value="driving">Driving</option>
                        <option value="walking">Walking</option>
                        <option value="bicycling">Bicycling</option>
                        <option value="transit">Transit</option>
                      </select>
                     </div>
                  </div>

                  {(isGenerated || isGeneratedAPI) && (
                    <p className="card-details">
                    Powered by <span className="ai-highlight">Concord AI 🤖</span>
                    </p>
                  )}
                  </p>

                  {isExpanded && (
                    <p className="card-details" style={{ fontSize: "0.9rem", color: "#555" }}>
                    {localData.description || "No additional details available."}
                  </p>
                  )}
                </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <ActivityModal
        show={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        lat={lat}
        long={long}
        query={query}
        onSelectActivity={handleSelectActivity}
      />
      <TravelMapModal
      show={showMapModal}
      onClose={() => setShowMapModal(false)}
      destLat={localData.lat}
      destLng={localData.long}
      onHide={() => setShowMapModal(false)}
      mapUrl={mapUrl}
      />

    </>
  );
};

export default ActivityCard;

