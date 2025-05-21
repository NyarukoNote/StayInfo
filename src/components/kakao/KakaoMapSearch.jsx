import React, { useEffect, useRef, useState } from "react";

const KakaoMapSearch = ({ onPlaceSelect }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    // 지도 초기화
    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
      level: 5,
    };

    mapInstance.current = new window.kakao.maps.Map(container, options);
  }, []);

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        alert("검색 결과가 없습니다.");
        return;
      }

      // 기존 마커 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const map = mapInstance.current;
      const bounds = new window.kakao.maps.LatLngBounds();

      data.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);
        const marker = new window.kakao.maps.Marker({
          map,
          position,
        });

        // 마커 클릭 시 InfoWindow 열기
        window.kakao.maps.event.addListener(marker, "click", () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }

          const infoDiv = document.createElement("div");
          infoDiv.style.padding = "8px";
          infoDiv.style.fontSize = "14px";
          infoDiv.innerHTML = `
            <strong>${place.place_name}</strong><br/>
          `;

          const addBtn = document.createElement("button");
          addBtn.textContent = "추가";
          addBtn.onclick = () => {
            if (onPlaceSelect) {
              onPlaceSelect({
                id: place.id,
                title: place.place_name,
                latitude: place.y,
                longitude: place.x,
              });
            }
            infoWindow.close();
          };

          infoDiv.appendChild(addBtn);

          const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoDiv,
          });

          infoWindow.open(map, marker);
          infoWindowRef.current = infoWindow;
        });

        bounds.extend(position);
        markersRef.current.push(marker);
      });

      map.setBounds(bounds);
    });
  };

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="장소 검색어 입력"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: "60%", marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default KakaoMapSearch;
