import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./tourSelectPage.css";

const API_KEY = process.env.REACT_APP_API_KEY;

const TourSelectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = location.state || {};

  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [radius, setRadius] = useState(50000);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    const fetchMotelCoords = async () => {
      try {
        const res = await axios.get(`/motel?name=${encodeURIComponent(name)}`);
        if (!res.data || res.data.length === 0)
          throw new Error("모텔 정보를 찾을 수 없습니다.");
        setX(res.data["경도"]);
        setY(res.data["위도"]);
      } catch (err) {
        setErrorMsg("모텔 정보를 불러올 수 없습니다.");
      }
    };
    if (name) fetchMotelCoords();
  }, [name]);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!x || !y) return;

      setLoading(true);
      setErrorMsg("");
      setCurrentPage(0);

      try {
        const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${API_KEY}&mapX=${x}&mapY=${y}&radius=${radius}&MobileOS=ETC&MobileApp=AppTest&_type=json`;
        // 디버깅 시작
        console.log("📡 API 호출 준비 중:", { x, y, radius });
        const res = await axios.get(url);
        console.log("📦 응답 받은 데이터:", res.data);
        // 디버깅 끝

        let items = res.data?.response?.body?.items?.item || [];
        // 숙박(contenttypeid 32) 제외
        items = items.filter((place) => place.contenttypeid !== "32");
        setPlaces(items);
      } catch {
        setErrorMsg("주변 관광 정보를 불러오는 데 실패했습니다.");
      }
      setLoading(false);
    };
    fetchPlaces();
  }, [x, y, radius]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const toggleSelectPlace = (place) => {
    setSelectedPlaces((prevSelected) => {
      const isSelected = prevSelected.some(
        (p) => p.contentid === place.contentid
      );
      if (isSelected) {
        return prevSelected.filter((p) => p.contentid !== place.contentid);
      } else {
        return [...prevSelected, place];
      }
    });
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = places.slice(offset, offset + itemsPerPage);

  // 이전 페이지로 이동
  const goBack = () => {
    navigate("/plan/motel"); // 모텔 선택 페이지 경로에 맞게 수정
  };

  // 다음 페이지로 선택된 데이터 전달하며 이동
  const goNext = () => {
    if (!x || !y || !name) {
      alert("모텔 정보가 불완전합니다.");
      return;
    }
    if (selectedPlaces.length === 0) {
      alert("하나 이상의 관광지를 선택해주세요.");
      return;
    }

    // 다음 페이지 경로 및 전달 데이터
    navigate("/plan", {
      state: {
        motel: { name, latitude: y, longitude: x },
        selectedTours: selectedPlaces.map((p) => ({
          title: p.title,
          latitude: p.mapy,
          longitude: p.mapx,
        })),
      },
    });
  };

  return (
    <div className="tour-select-page">
      <Navbar />
      <Header />

      <div className="content-container">
        <h1>2. 주변 관광지 선택</h1>
        <h3>기준 모텔: {name}</h3>

        <div className="radius-selector">
          <label htmlFor="radius">검색 반경 (m): </label>
          <select
            id="radius"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          >
            {[500, 1000, 2000, 3000, 4000, 5000].map((val) => (
              <option key={val} value={val}>
                {val.toLocaleString()} m
              </option>
            ))}
          </select>
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}
        {loading ? (
          <p>관광지 정보를 불러오는 중입니다...</p>
        ) : currentItems.length > 0 ? (
          <>
            <div className="tour-list">
              {currentItems.map((place) => {
                const isSelected = selectedPlaces.some(
                  (p) => p.contentid === place.contentid
                );
                return (
                  <div
                    key={place.contentid}
                    className={`tour-card ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleSelectPlace(place)}
                  >
                    <img
                      src={place.firstimage || "/image/default.png"}
                      alt={place.title}
                      className="tour-image"
                    />
                    <h3>{place.title}</h3>
                    <p>{place.addr1 || "주소 정보 없음"}</p>
                  </div>
                );
              })}
            </div>

            <ReactPaginate
              previousLabel={"이전"}
              nextLabel={"다음"}
              breakLabel={"..."}
              pageCount={Math.ceil(places.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </>
        ) : (
          <p>반경 {radius.toLocaleString()}m 내 관광지를 찾을 수 없습니다.</p>
        )}

        {selectedPlaces.length > 0 && (
          <div className="selected-places">
            <h2>선택한 관광지 목록</h2>
            <ul>
              {selectedPlaces.map((place) => (
                <li key={place.contentid}>
                  {place.title} - {place.addr1 || "주소 정보 없음"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 이전 / 다음 버튼 */}
        <div className="navigation-buttons">
          <button className="back-button" onClick={goBack}>
            이전 (모텔 선택으로)
          </button>
          <button className="next-button" onClick={goNext}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourSelectPage;
