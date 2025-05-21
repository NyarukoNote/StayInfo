import React, { useEffect } from "react";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./motelmappage.css"; // 기존 스타일 재사용

const { kakao } = window;

const MotelMapPage = () => {
  useEffect(() => {
    // 지도를 생성합니다
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 기준
      level: 7,
    };

    const map = new kakao.maps.Map(container, options);

    // TODO: 모텔 좌표 배열로 마커 추가
    const motelData = [
      {
        name: "예시 모텔 1",
        lat: 37.5665,
        lng: 126.978,
      },
      {
        name: "예시 모텔 2",
        lat: 37.57,
        lng: 126.982,
      },
    ];

    motelData.forEach((motel) => {
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(motel.lat, motel.lng),
      });

      const infoWindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${motel.name}</div>`,
      });

      kakao.maps.event.addListener(marker, "mouseover", () => {
        infoWindow.open(map, marker);
      });

      kakao.maps.event.addListener(marker, "mouseout", () => {
        infoWindow.close();
      });
    });
  }, []);

  return (
    <div>
      <Navbar />
      <Header activeItem="stays-map" />
      <div className="motel-page">
        <h1>지도 기반 모텔 검색</h1>
        <div id="map" style={{ width: "100%", height: "600px" }}></div>
      </div>
    </div>
  );
};

export default MotelMapPage;
