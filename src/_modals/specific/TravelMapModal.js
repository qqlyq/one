import React from "react";
import { Modal, Button } from "react-bootstrap";

const TravelMapModal = ({ show, onHide, mapUrl }) => {
  return (
    <Modal show={show} onHide={onHide} dialogClassName="custom-map-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title>Directions to Your Destination</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <iframe
          width="100%"
          height="400px"
          src={mapUrl}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TravelMapModal;
