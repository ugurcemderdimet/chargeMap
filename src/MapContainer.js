import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "bootstrap/dist/css/bootstrap.min.css";

const MapContainer = () => {
  const mapStyles = {
    height: "100vh",
    width: "100%",
  };

  const defaultCenter = {
    lat: 51.905445,
    lng: 4.466637,
  };

  const [distance, setDistance] = useState("100");
  const [type2, setType2] = useState(false);
  const [chademo, setChademo] = useState(false);
  const [ccs, setCcs] = useState(false);
  const [chargeStations, setChargeStations] = useState([]);
  const [infoWindow, setInfoWindow] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState();
  const [selectedStation, setSelectedStation] = useState();

  const onSearch = () => {
    let types = [];
    if (type2) types.push("25");
    if (chademo) types.push("2");
    if (ccs) types.push("33");
    types = types.join(",");

    fetch(
      `https://api.openchargemap.io/v3/poi/?output=json&camelcase=true&distance=${distance}&distanceunit=KM&connectiontypeid=${types}&latitude=51.905445&longitude=4.466637&key=a36c70f1-13a0-49c1-8848-e4f27788c7d5`
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setChargeStations(response);
        console.log("response", response);
      });
    types = [];
  };

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <>
      <div style={{ width: "100%" }}>
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid ">
            <div className="col-xs-4">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Max Distance"
                onChange={(e) => setDistance(e.target.value)}
              ></input>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                value="25"
                checked={type2}
                onChange={(e) => setType2(!type2)}
              />
              <label
                className="form-check-label"
                style={{ paddingRight: "10px" }}
              >
                Type2
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                value="2"
                checked={chademo}
                onChange={(e) => setChademo(!chademo)}
              />
              <label
                className="form-check-label"
                style={{ paddingRight: "10px" }}
              >
                CHAdeMO
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                value="33"
                checked={ccs}
                onChange={(e) => setCcs(!ccs)}
              />
              <label
                className="form-check-label"
                style={{ paddingRight: "10px" }}
              >
                CCS
              </label>
            </div>
            <button className="btn btn-secondary" onClick={() => onSearch()}>
              Search
            </button>
          </div>
        </nav>
      </div>
      <LoadScript googleMapsApiKey="AIzaSyCZh0FazzYXZ3VoeV7YwuKBKUB6cyW3BOc">
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
        >
          <Marker position={defaultCenter} />

          {chargeStations.map((chargingStation, idx) => {
            return (
              <Marker
                onClick={(e) => {
                  setSelectedPosition({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                  setInfoWindow(true);
                  setSelectedStation(chargingStation);
                  console.log("chargingStation", chargingStation);
                }}
                key={idx}
                style={{ width: "1px", height: "1px" }}
                icon={{
                  url: chargingStation.statusType.isUserSelectable
                    ? "./green.png"
                    : "./red.png",
                  scaledSize: { width: 25, height: 25 },
                }}
                position={{
                  lat: chargingStation.addressInfo.latitude,
                  lng: chargingStation.addressInfo.longitude,
                }}
              ></Marker>
            );
          })}

          {infoWindow && (
            <InfoWindow
              position={selectedPosition}
              onCloseClick={() => setInfoWindow(false)}
            >
              <>
                {console.log("selectedStation:", selectedStation)}
                <div id="main">
                  <div id="title">
                    <label>
                      <strong
                        style={{
                          color: "#000",
                          textTransform: "uppercase",
                          fontSize: "13px",
                          letterSpacing: "1px",
                          marginBottom: "10px",
                          marginTop: "7px",
                          display: "block",
                        }}
                      >
                        {selectedStation && selectedStation.addressInfo.street}{" "}
                        {selectedStation && selectedStation.addressInfo.zip}{" "}
                        {selectedStation && selectedStation.addressInfo.town} (
                        {selectedStation &&
                          selectedStation.addressInfo.country.title}
                        )
                      </strong>
                    </label>
                  </div>
                  <div id="operator">
                    <table>
                      <tr>
                        <td colSpan="2">
                          <strong
                            style={{
                              color: "#333",
                              textTransform: "uppercase",
                              fontSize: "13px",
                              letterSpacing: "1px",
                            }}
                          >
                            Operator
                          </strong>
                        </td>
                        <td colSpan="2"></td>
                        <td colSpan="2">
                          <strong
                            style={{
                              color: "#333",
                              textTransform: "uppercase",
                              fontSize: "13px",
                              letterSpacing: "1px",
                            }}
                          >
                            Latitude{" "}
                          </strong>{" "}
                          {selectedStation &&
                            selectedStation.addressInfo.latitude}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          {selectedStation &&
                            selectedStation.operatorInfo &&
                            selectedStation.operatorInfo.title}
                        </td>
                        <td colSpan="3">
                          <strong
                            style={{
                              color: "#333",
                              textTransform: "uppercase",
                              fontSize: "13px",
                              letterSpacing: "1px",
                            }}
                          >
                            Longitude{" "}
                          </strong>
                          {selectedStation &&
                            selectedStation.addressInfo.longitude}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td colSpan="3">
                          <strong
                            style={{
                              color: "#333",
                              textTransform: "uppercase",
                              fontSize: "13px",
                              letterSpacing: "1px",
                            }}
                          >
                            Distance{" "}
                          </strong>
                          {selectedStation &&
                            selectedStation.addressInfo.distance}{" "}
                          km
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div id="status">
                    <label style={{ display: "block", margin: "10px 0" }}>
                      <strong
                        style={{
                          color: "#333",
                          textTransform: "uppercase",
                          fontSize: "13px",
                          letterSpacing: "1px",
                        }}
                      >
                        Status:{" "}
                      </strong>
                      {selectedStation &&
                      selectedStation.statusType.isUserSelectable
                        ? "Available"
                        : "Occupied"}
                    </label>
                  </div>
                  <div id="connectors">
                    <div style={{ display: "block", marginBottom: "10px" }}>
                      <strong
                        style={{
                          color: "#333",
                          textTransform: "uppercase",
                          fontSize: "13px",
                          letterSpacing: "1px",
                        }}
                      >
                        Connectors
                      </strong>
                    </div>
                    <div>
                      <table className="tables" border="1">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th
                              style={{
                                color: "#fff",
                                textTransform: "uppercase",
                                fontSize: "13px",
                                letterSpacing: "1px",
                              }}
                            >
                              Plug Type
                            </th>
                            <th
                              style={{
                                color: "#fff",
                                textTransform: "uppercase",
                                fontSize: "13px",
                                letterSpacing: "1px",
                              }}
                            >
                              Max Power
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStation &&
                            selectedStation.connections.map(
                              (connector, idx) => {
                                return (
                                  <tr>
                                    <td>{idx + 1}</td>
                                    <td>{connector.connectionType.title}</td>
                                    <td>{connector.powerKW}</td>
                                  </tr>
                                );
                              }
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          margin: "15px 0px 10px 0px",
                        }}
                      >
                        <strong
                          style={{
                            color: "#333",
                            textTransform: "uppercase",
                            fontSize: "13px",
                            letterSpacing: "1px",
                          }}
                        >
                          Pricing Info
                        </strong>
                      </label>
                    </div>
                    <div>
                      <label>
                        {selectedStation && selectedStation.usageCost}
                      </label>
                    </div>
                  </div>
                </div>
              </>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default MapContainer;
