import React, {useContext, useEffect, useState, useRef} from "react";
import TimelineComponent from "../_components/common/TimelineComponent";
import {ActivitiesContext} from "../context/ActivitiesContext";
import { ActivitiesProvider } from "../context/ActivitiesContext";
import AllLocationGuide from "../_modals/specific/AllLocationGuide";
import { Button } from "react-bootstrap";



const OneDay = () => {
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const { activities, changeAllActivities,processedActivities, removedActivities, newActivities,planId } = useContext(ActivitiesContext);
  const [geoActivities, setGeoActivities] = useState([]);
  const [activitiesList, setActivitiesList] = useState([]);
  console.log(planId)
  useEffect(() => {
    if (activities.length > 0) {
      try {
        const list = processedActivities(0);
        setActivitiesList(list);
      } catch (err) {
        console.error("Error processing activities:", err);
      }
    }
  }, [activities]);
  console.log("activities",activities)
  console.log("activitiesList",activitiesList)
  useEffect(() => {
    if (activitiesList.length === 0) return;
          const fetchCoordinates = async () => {
            try {
              
              
        
              const promises = activitiesList.map(async (activity, index) => {
                // console.log(`Fetching coordinates for Activity ${index + 1}:`, activity.place_id);
        
                if (!activity.place_id) return null;
        
                try {
                  const response = await fetch(
                    `https://citygetaway-backend-plan-service.vercel.app/api/place_lat_lng?place_id=${activity.place_id}`,
                    {
                      headers: {
                        "X-User-Name": "testDan",
                        "X-User-Id": "681a6db71771cb427864f564",
                      },
                    }
                  );
        
                  if (!response.ok) {
                    console.error(`Failed to fetch for ${activity.place_id}:`, response.statusText);
                    return null;
                  }
                  // console.log("day",activity);
        
                  const data = await response.json();
        
                  if (data?.lat && data?.lng) {
                    return {
                      ...activity,
                      lat: data.lat,
                      lng: data.lng,
                    };
                  } else {
                    console.warn(`No lat/lng for activity with place_id ${activity.place_id}`);
                    return null;
                  }
                } catch (err) {
                  console.error(`Error fetching coordinates for ${activity.place_id}:`, err);
                  return null;
                }
              });
        
              const results = await Promise.all(promises);
              const filtered = results.filter(Boolean);
              console.log(filtered)
              setGeoActivities(filtered);
            } catch (error) {
              console.error("Error in fetchCoordinates:", error);
            }
          };
        
          fetchCoordinates();
        }, [activitiesList]);

        return (
          <div>
            <div style={{ padding: "20px" }}>
              <h1>One Day Itinerary</h1>
              <Button
                className="map-button mx-2"
                variant="light"
                onClick={() => setShowMapModal(true)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "20px",
                  border: "2px solid #00aeef",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-map"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.5.5 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103M10 1.91l-4-.8v12.98l4 .8zm1 12.98 4-.8V1.11l-4 .8zm-6-.8V1.11l-4 .8v12.98z"
                  />
                </svg>
                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}> Map</span>
              </Button>
        
              {/* Only render when ready */}
              {activitiesList.length > 0 ? (
                <TimelineComponent
                  activities={activitiesList}
                  removedActivities={[]}
                  newActivities={[]}
                  day_index={0}
                  setModalType={setModalType}
                  setModalData={setModalData}
                  setShowModal={setShowModal}
                />
              ) : (
                <p>Loading activities...</p>
              )}
            </div>
        
           
            
  <AllLocationGuide
    show={showMapModal}
    onHide={() => setShowMapModal(false)}
    activities={geoActivities}
    day={1}
    planId={planId}
    dialogClassName="fullscreen-map-modal"
  centered
  fullscreen
  />

          </div>
        );
        
};

export default OneDay;
