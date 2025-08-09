import React, { useEffect, useState } from 'react';

const haversineDistance = (coords1: any, coords2: any) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);

  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
};

const StepTracker: React.FC = () => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [distance, setDistance] = useState(0);
  const [steps, setSteps] = useState(0);

  useEffect(() => {

const fetchStepData = async () => {
  const token = localStorage.getItem('token');

  const res = await fetch('/api/steps/today', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  setSteps(data.steps);
  setDistance(data.distanceKm);
};    let watchId: number;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition((position) => {
        const newLocation = position.coords;

        if (location) {
          const dist = haversineDistance(location, newLocation);
          if (dist > 1) {
            setDistance((prev) => prev + dist);
            setSteps((prev) => prev + Math.floor(dist / 0.8)); // ~0.8m per step
          }
        }

        setLocation(newLocation);
      }, (err) => {
        console.error('GPS error:', err);
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [location]);

  return (
    <div className="glass step-tracker-box">
      <h2 className="premium-section-title">Step Tracker</h2>
      <p><strong>Steps:</strong> {steps}</p>
      <p><strong>Distance:</strong> {(distance / 1000).toFixed(2)} km</p>
    </div>
  );
};

export default StepTracker;
