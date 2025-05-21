import React, { useEffect, useRef } from 'react';
import './mapcomponent.css';

const MapComponent = ({ latitude, longitude }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=eb98abcb8a6191c2c872bb19fa201bc2&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        const mapOption = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapRef.current, mapOption);

        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({ position: markerPosition });
        marker.setMap(map);
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [latitude, longitude]);

  return <div ref={mapRef} className="map-container"></div>;
};

export default MapComponent;