import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import KakaoMapRouteView from "../../components/kakao/KakaoMapRouteView";
import "./tourResult.css"; // 추가

const TourResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itinerary, motel, places } = location.state || {};

  if (!itinerary || !motel || !places) {
    alert("여행 계획 데이터가 부족합니다. 이전 페이지로 이동합니다.");
    navigate(-1);
    return null;
  }

  // 출발지-도착지를 추출 (임시 파싱 로직)
  const extractRoutes = () => {
    const routeRegex =
      /^\s*-?\s*출발지:\s*(.+?)\s*\n\s*-?\s*도착지:\s*(.+?)\s*$/gm;
    const matches = itinerary.matchAll(routeRegex);
    const routes = [];
    console.log(motel);
    console.log(places);

    for (const match of matches) {
      const fromName = match[1].trim();
      const toName = match[2].trim();

      const from =
        fromName === motel.name
          ? {
              name: motel.title,
              latitude: parseFloat(motel.latitude),
              longitude: parseFloat(motel.longitude),
            }
          : (() => {
              const place = places.find((p) => p.title === fromName);
              return place
                ? {
                    name: place.title,
                    latitude: parseFloat(place.latitude),
                    longitude: parseFloat(place.longitude),
                  }
                : { name: fromName };
            })();

      const to =
        toName === motel.title
          ? {
              name: motel.title,
              latitude: parseFloat(motel.latitude),
              longitude: parseFloat(motel.longitude),
            }
          : (() => {
              const place = places.find((p) => p.title === toName);
              return place
                ? {
                    name: place.title,
                    latitude: parseFloat(place.latitude),
                    longitude: parseFloat(place.longitude),
                  }
                : { name: toName };
            })();

      if (
        from.latitude &&
        to.latitude &&
        !isNaN(from.latitude) &&
        !isNaN(to.latitude)
      ) {
        routes.push({ from, to });
      }
    }

    return routes;
  };

  const routes = extractRoutes();

  return (
    <div>
      <Navbar />
      <Header />
      <div className="tour-result-container">
        <h1>4. 생성된 여행 계획 결과</h1>

        {routes.map((route, idx) => (
          <div key={idx}>
            <h3>
              {idx + 1}. {route.from.name} → {route.to.name}
            </h3>
            <KakaoMapRouteView from={route.from} to={route.to} />
          </div>
        ))}

        <div className="itinerary-text">{itinerary}</div>

        <button className="back-button" onClick={() => navigate(-1)}>
          이전으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default TourResult;
