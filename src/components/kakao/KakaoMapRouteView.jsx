import React, { useEffect } from "react";

const KakaoMapRouteView = ({ from, to }) => {
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    const containerId = `map-${from.name}-${to.name}`;
    const container = document.getElementById(containerId);
    if (!container) return;

    const kakao = window.kakao;

    const mapOption = {
      center: new kakao.maps.LatLng(from.latitude, from.longitude),
      level: 5,
    };

    const map = new kakao.maps.Map(container, mapOption);

    const linePath = [
      new kakao.maps.LatLng(from.latitude, from.longitude),
      new kakao.maps.LatLng(to.latitude, to.longitude),
    ];

    // 선 그리기
    new kakao.maps.Polyline({
      map,
      path: linePath,
      strokeWeight: 5,
      strokeColor: "#FF6F61",
      strokeOpacity: 0.8,
      strokeStyle: "solid",
    });

    // 출발지 마커
    new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(from.latitude, from.longitude),
      title: `출발지: ${from.name}`,
    });

    // 도착지 마커
    new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(to.latitude, to.longitude),
      title: `도착지: ${to.name}`,
    });
  }, [from, to]);

  return (
    <div
      id={`map-${from.name}-${to.name}`}
      className="map-box"
      style={{ width: "100%", height: "300px", marginBottom: "20px" }}
    />
  );
};

export default KakaoMapRouteView;
