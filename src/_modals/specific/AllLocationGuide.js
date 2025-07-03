import React, { useEffect, useRef, useState  } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../styles/AllLocationGuide.css"
import { MarkerClusterer } from "@googlemaps/markerclusterer";


const AllLocationGuide = ({ show, onHide, activities,day,planId }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const boundsRef = useRef(null);
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const isFullscreenRef = useRef(isFullscreen);
    const [audioLang, setAudioLang] = useState("en");
  const availableLanguages = Object.keys(selectedActivity?.audio_filename || {});
  const [isPlaying, setIsPlaying] = useState(false);





const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
};
useEffect(() => {
  isFullscreenRef.current = isFullscreen;
}, [isFullscreen]);


    useEffect(() => {
        if (show && window.google && activities?.length > 0) {
          initMap();
        } else if (show && !window.google) {
          loadGoogleMapsScript(() => initMap());
        }
      }, [show, activities]);

    const loadGoogleMapsScript = (callback) => {
        if (document.getElementById("google-maps-script")) {
          callback();
          return;
        }
      
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
        script.async = true; // ✅ Load asynchronously
        script.defer = true; // ✅ Defer execution
        script.onload = callback;
      
        // Recommended: Set loading attribute
        script.setAttribute("loading", "async");
      
        document.body.appendChild(script);
      };

      const initMap = () => {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: { lat: 45.5017, lng: -73.5673 },
          fullscreenControl: false,
        });
      
        const bounds = new window.google.maps.LatLngBounds();
        const infoWindow = new window.google.maps.InfoWindow();
      
        const validActivities = activities.filter((a) => a.lat && a.lng);
        const markers = [];
      
        validActivities.forEach((activity, index) => {
          const position = { lat: activity.lat, lng: activity.lng };
      
          const marker = new window.google.maps.Marker({
            position,
            title: activity.name,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                  <circle cx="20" cy="20" r="18" fill="#00aeef" stroke="white" stroke-width="2"/>
                  <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="16" font-weight="bold" dy=".3em">${index + 1}</text>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            },
          });
      
          marker.addListener("mouseover", () => {
            infoWindow.setContent(`<div><strong>${activity.name}</strong></div>`);
            infoWindow.open(map, marker);
          });
      
          marker.addListener("mouseout", () => {
            infoWindow.close();
          });
      
          marker.addListener("click", () => {
            if (isFullscreenRef.current) {
              setSelectedActivity(activity);
            } else {
              map.setCenter(position);
              infoWindow.setContent(`<div>${activity.name}</div>`);
              infoWindow.open(map, marker);
            }
          });
      
          bounds.extend(position);
          markers.push(marker);
        });
      
        map.fitBounds(bounds);
        mapInstance.current = map;
        boundsRef.current = bounds;
        // Show user location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const userMarker = new window.google.maps.Marker({
        position: userLatLng,
        map: mapInstance.current,
        title: "Your Location",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });
      const userInfoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>My Location</strong></div>`,
      });

      userInfoWindow.open(mapInstance.current, userMarker);

      // Optional: Extend bounds to include user
      bounds.extend(userLatLng);
      map.fitBounds(bounds);
    },
    (error) => {
      console.warn("Geolocation error:", error);
    }
  );
} else {
  console.warn("Geolocation not supported by this browser.");
}


        fetch(`http://127.0.0.1:8002/api/polyline?plan_id=${planId}`)
  .then(res => res.json())
  .then(data => {
    if (data.polyline.polyline) {
      console.log(data)
      console.log("yes polyline",data.polyline.polyline)
      // ✅ Polyline exists, decode and draw it
      const decodedPath = window.google.maps.geometry.encoding.decodePath(data.polyline.polyline);
      const polyline = new window.google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "#00aeef",
        strokeOpacity: 1.0,
        strokeWeight: 4,
      });
      polyline.setMap(mapInstance.current);
    } else {
      // ❌ No polyline, compute it using Directions API
      console.log("No polyline")
      if (validActivities.length >= 2) {
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
          preserveViewport: true,
        });
        directionsRenderer.setMap(mapInstance.current);

        const origin = {
          lat: validActivities[0].lat,
          lng: validActivities[0].lng,
        };
        const destination = {
          lat: validActivities[validActivities.length - 1].lat,
          lng: validActivities[validActivities.length - 1].lng,
        };
        const waypoints = validActivities.slice(1, -1).map((a) => ({
          location: { lat: a.lat, lng: a.lng },
          stopover: true,
        }));

        directionsService.route(
          {
            origin,
            destination,
            waypoints,
            travelMode: window.google.maps.TravelMode.WALKING,
          },
          (result, status) => {
            if (status === "OK") {
              directionsRenderer.setDirections(result);
              console.log("result",result)
              const encodedPath = result.routes[0].overview_polyline;

              if (encodedPath) {
                fetch("http://127.0.0.1:8002/api/save_polyline", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    polyline: encodedPath,
                    plan_id: planId
                  })
                })
                .then(res => res.json())
                .then(data => {
                  console.log("Polyline saved:", data);
                })
                .catch(err => {
                  console.error("Failed to save polyline:", err);
                });
              }
            } else {
              console.error("Directions request failed due to " + status);
            }
          }
        );
      }
    }
  })
  .catch(err => {
    console.error("Error fetching polyline:", err);
  });

      
        // Optional: Use MarkerClusterer if you still want clustering
        new MarkerClusterer({ markers, map });
      };
      
      
      console.log(availableLanguages)
      console.log(selectedActivity)

   

    return (
        <Modal
  show={show}
  onHide={() => {
    setIsFullscreen(false);
    onHide();
  }}
  dialogClassName={isFullscreen ? "fullscreen-map-modal" : "custom-map-modal"}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Activity Locations For One Day Quebec Tour</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <div
      id="map"
      ref={mapRef}
      className="map-container"
      style={{ width: "100%", height: "100%" }}
    />
    <div className="d-flex justify-content-between align-items-center p-2 bg-white border-top">
      
      <Button variant="primary" onClick={toggleFullscreen}>
        {isFullscreen ? "Exit Full Screen" : "Full Screen"}
      </Button>
    </div>
    {isFullscreen && selectedActivity && (
      <div className="fullscreen-popup shadow-lg">
        <div className="popup-card-with-image">
          {selectedActivity.image_url && (
            <img
              src={selectedActivity.image_url}
              alt={selectedActivity.name}
              className="popup-image"
            />
          )}
          <div className="popup-details">
            <h4 className="popup-title">{selectedActivity.name}</h4>
            <p className="popup-info">
              <strong>🕒</strong>{" "}
              {selectedActivity.start_time && selectedActivity.end_time
                ? `${selectedActivity.start_time} ${selectedActivity.start_time_amPm} - ${selectedActivity.end_time} ${selectedActivity.end_time_amPm}`
                : "Not listed"}
            </p>
            <p className="popup-info">
          <strong>💰 Price:</strong> {selectedActivity.price || "Not listed"}
          </p>
          {selectedActivity?.audio_filename ? (
  <div className="mb-2 d-flex align-items-center">
    <strong className="me-2">🔈 Audio:</strong>
    {!isPlaying ? (
      <Button
        size="sm"
        variant="outline-primary"
        className="me-2"
        onClick={() => {
          if (!window.audioPlayer) {
            window.audioPlayer = new Audio(`/audio/en/${selectedActivity.audio_filename}`);
            window.audioPlayer.addEventListener("ended", () => {
              setIsPlaying(false);
              window.audioPlayer = null;
            });
          }
          window.audioPlayer.play();
          setIsPlaying(true);
        }}
      >
        ▶ Play
      </Button>
    ) : (
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => {
          if (window.audioPlayer) {
            window.audioPlayer.pause();
          }
          setIsPlaying(false);
        }}
      >
        ⏸ Pause
      </Button>
    )}
  </div>
) : (
  <p className="text-muted">No audio available</p>
)}





        <p className="popup-description">
          {selectedActivity.description || "No description available."}
        </p>
        <div className="text-end">
          <Button size="sm" variant="outline-secondary" onClick={() => setSelectedActivity(null)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  </div>
)}





  </Modal.Body>
</Modal>

    );
};

export default AllLocationGuide;

