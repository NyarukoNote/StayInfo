import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import KakaoMapSearch from "../../components/kakao/KakaoMapSearch";
import "./tourplan.css"; // CSS 임포트

const TourPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { motel, selectedTours: initialTours } = location.state || {};
  const [selectedTours, setSelectedTours] = useState(initialTours || []);

  const [startDate, setStartDate] = useState(""); // ex) "2025-05-17"
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [returnTime, setReturnTime] = useState("21:00");

  // 생성된 여행 계획 텍스트 상태
  const [itineraryText, setItineraryText] = useState("");

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!motel || !selectedTours || selectedTours.length === 0) {
      alert("모텔 또는 관광지 정보가 부족합니다.");
      return;
    }

    if (!startDate || !endDate) {
      alert("여행 시작 날짜와 종료 날짜를 모두 입력해주세요.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("종료 날짜는 시작 날짜 이후여야 합니다.");
      return;
    }

    if (!startTime || !returnTime) {
      alert("시작 시간과 귀가 시간을 입력해주세요.");
      return;
    }

    // 여행 일수 계산 (종료일 포함)
    const dayCount =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24) +
      1;

    setLoading(true);
    try {
      const response = await axios.post("/tourplan", {
        motel: {
          name: motel.name,
          x: motel.longitude,
          y: motel.latitude,
        },
        places: selectedTours.map((place) => ({
          name: place.title,
          x: place.longitude,
          y: place.latitude,
        })),
        schedule: {
          startDate,
          endDate,
          days: dayCount,
          startTime,
          returnTime,
        },
      });

      const itinerary = response.data.itinerary;
      setItineraryText(itinerary);
      alert("서버로 성공적으로 전달되었고, 여행 계획이 생성되었습니다.");

      setLoading(false);

      // 결과 페이지로 이동
      navigate("/plan/result", {
        state: {
          itinerary,
          motel,
          places: selectedTours, // 장소 전체 전달
        },
      });
    } catch (err) {
      setLoading(false);
      console.error("전송 실패:", err);
      alert("서버로 데이터를 전송하는 데 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <Header />
      <h1>3. 여행 계획 확인 및 전송</h1>

      <h2>선택한 모텔</h2>
      {motel ? (
        <div>
          <p>
            <strong>{motel.name}</strong>
          </p>
        </div>
      ) : (
        <p>모텔 정보가 없습니다.</p>
      )}

      <h2>선택한 관광지 목록</h2>
      {selectedTours.length > 0 ? (
        <ul>
          {selectedTours.map((tour, index) => (
            <li key={tour.id || index}>{tour.title}</li>
          ))}
        </ul>
      ) : (
        <p>선택된 관광지가 없습니다.</p>
      )}

      <KakaoMapSearch
        onPlaceSelect={(place) => {
          const alreadyExists = selectedTours.some((p) => p.id === place.id);
          if (!alreadyExists) {
            setSelectedTours((prev) => [...prev, place]);
          } else {
            alert("이미 추가된 관광지입니다.");
          }
        }}
      />

      <h2>여행 일정 입력</h2>
      <div>
        <label>
          여행 시작 날짜:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
          />
        </label>
      </div>

      <div>
        <label>
          여행 종료 날짜:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
          />
        </label>
      </div>

      <div>
        <label>
          여행 시작 시간:{" "}
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={loading}
          />
        </label>
      </div>

      <div>
        <label>
          집에 돌아가는 시간:{" "}
          <input
            type="time"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            disabled={loading}
          />
        </label>
      </div>

      <button
        onClick={handleSubmit}
        style={{ marginTop: "20px" }}
        disabled={loading}
      >
        여행 계획 서버로 전송
      </button>

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div>여행 계획 생성 중입니다...</div>
        </div>
      )}

      {/* 생성된 여행 계획 표시 (결과 페이지로 이동 후 안 보임) */}
      {itineraryText && !loading && (
        <div style={{ marginTop: "40px", whiteSpace: "pre-line" }}>
          <h2>🗓️ 생성된 여행 계획</h2>
          <p>{itineraryText}</p>
        </div>
      )}
    </div>
  );
};

export default TourPlan;
