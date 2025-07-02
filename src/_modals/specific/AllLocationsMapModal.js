import React, { useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";

const AllLocationsMapModal = ({ show, onHide, activities,day }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const boundsRef = useRef(null);
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        if (show && window.google) {
            initMap();
        } else if (show) {
            loadGoogleMapsScript(() => initMap());
        }
    }, [show]);

    const loadGoogleMapsScript = (callback) => {
        if (document.getElementById("google-maps-script")) {
            callback();
            return;
        }

        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = callback;
        document.body.appendChild(script);
    };

    const initMap = () => {
        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 13,
            center: { lat: 45.5017, lng: -73.5673 },
        });
    
        const bounds = new window.google.maps.LatLngBounds();
        const infoWindow = new window.google.maps.InfoWindow();
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true, // we'll add custom markers
        });
        directionsRenderer.setMap(map);
    
        const validActivities = activities.filter(a => a.lat && a.lng);
        const pathCoordinates = validActivities.map(a => ({ lat: a.lat, lng: a.lng }));
    
        // Add markers
        validActivities.forEach((activity, index) => {
            const position = { lat: activity.lat, lng: activity.lng };
            const marker = new window.google.maps.Marker({
                position,
                map,
                title: activity.name,
                label: {
                    text: `${index + 1}`,
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
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
                map.setZoom(17);
                map.setCenter(position);
                infoWindow.setContent(`<div>${activity.name}</div>`);
                infoWindow.open(map, marker);
            });
    
            bounds.extend(position);
        });
    // This API key is not authorized to use this service or API.  
    // For more information on authentication and Google Maps JavaScript API services 
    // please see: https://developers.google.com/maps/documentation/javascript/get-api-key?utm_source=devtools&utm_campaign=stable
        // Route via DirectionsService if at least 2 points
//         if (pathCoordinates.length >= 2) {
//             console.log("Path coordinates:", pathCoordinates);

//             const origin = new window.google.maps.LatLng(pathCoordinates[0].lat, pathCoordinates[0].lng);
// const destination = new window.google.maps.LatLng(
//     pathCoordinates[pathCoordinates.length - 1].lat,
//     pathCoordinates[pathCoordinates.length - 1].lng
// );
// const waypoints = pathCoordinates.slice(1, -1).map(coord => {
//     console.log("Waypoint:", coord.lat, coord.lng);  // 👈 This will print each lat/lng
//     return {
//         location: new window.google.maps.LatLng(coord.lat, coord.lng),
//         stopover: true,
//     };
// });

    
//             directionsService.route(
//                 {
//                     origin,
//                     destination,
//                     waypoints,
//                     travelMode: window.google.maps.TravelMode.WALKING, // or WALKING
//                 },
//                 (result, status) => {
//                     if (status === "OK") {
//                         directionsRenderer.setDirections(result);
//                     } else {
//                         console.error("Directions request failed due to ", status);
//                     }
//                 }
//             );
//         }
if (pathCoordinates.length >= 2) {
    const activityPath = new window.google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        icons: [
          {
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 2, // optional: increase arrow size
              strokeColor: "#FF0000",
            },
            offset: "0%",
            repeat: "50px", // arrow every 50 pixels
          },
        ],
      });
      
      

    activityPath.setMap(map);
}
    
        map.fitBounds(bounds);
        mapInstance.current = map;
        boundsRef.current = bounds;
    };
    

    const resetMapView = () => {
        if (mapInstance.current && boundsRef.current) {
            mapInstance.current.fitBounds(boundsRef.current);
        }
    };

    return (
        <Modal show={show} onHide={onHide} dialogClassName="custom-map-modal" centered>
            <Modal.Header closeButton>
                <Modal.Title>Activity Locations For Day {day}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div
                    ref={mapRef}
                    style={{ height: "500px", width: "100%", display: "block" }}
                />
                <div className="d-flex justify-content-end mt-2">
                    <Button variant="secondary" onClick={resetMapView}>
                        Zoom Out to All
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AllLocationsMapModal;

