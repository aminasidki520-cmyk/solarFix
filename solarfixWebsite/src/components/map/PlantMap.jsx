import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MOROCCO_CENTER = [31.7917, -7.0926];

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function parseGeometry(geometry) {

    if (!geometry) return null;

    const coordinates = geometry
        .replace("POINT(", "")
        .replace(")", "")
        .trim()
        .split(" ");

    const latitude = Number(coordinates[0]);
    const longitude = Number(coordinates[1]);

    return [latitude, longitude];
}

export default function PlantMap({ anomalies = [] }) {

    return (

        <MapContainer
            center={MOROCCO_CENTER}
            zoom={6}
            scrollWheelZoom
            style={{
                height: "480px",
                width: "100%"
            }}
        >

            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {(Array.isArray(anomalies) ? anomalies : []).map((anomaly)=> {

                const position = parseGeometry(anomaly.geometry);

                if (!position) return null;

                return (

                    <Marker
                        key={anomaly.anomalyId}
                        position={position}
                    >

                        <Popup>

                            <strong>
                                {anomaly.anomalyType}
                            </strong>

                            <br />

                            Severity :
                            {" "}
                            {anomaly.severity}

                            <br />

                            Region :
                            {" "}
                            {anomaly.region}

                        </Popup>

                    </Marker>

                );

            })}

        </MapContainer>

    );

}