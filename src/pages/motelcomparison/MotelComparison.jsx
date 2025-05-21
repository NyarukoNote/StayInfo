import React, { useState, useEffect } from "react";
import axios from "axios";
import "./motelcomparison.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

const PAGE_SIZE = 10; // 한 페이지당 10개

const MotelComparison = () => {
  const [motels, setMotels] = useState([]);
  const [selectedMotels, setSelectedMotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMotelsData = async () => {
      try {
        const response = await axios.get("/data?fields=업체명,주소,서비스");

        if (!response.data) {
          console.error("No data received");
          return;
        }

        let motelList = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data);

        setMotels(motelList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMotelsData();
  }, []);

  // 모텔 선택/취소 핸들러
  const handleSelect = (motel) => {
    if (selectedMotels.some((m) => m["업체명"] === motel["업체명"])) {
      // 이미 선택된 모텔이면 선택 취소
      setSelectedMotels(
        selectedMotels.filter((m) => m["업체명"] !== motel["업체명"])
      );
    } else if (selectedMotels.length < 2) {
      // 두 개까지만 선택 가능
      setSelectedMotels([...selectedMotels, motel]);
    }
  };

  // 검색 필터 적용
  const filteredMotels = motels.filter((motel) =>
    motel["업체명"].toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 페이지네이션 적용
  const totalPages = Math.ceil(filteredMotels.length / PAGE_SIZE);
  const currentMotels = filteredMotels.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div>
      <Navbar />
      <Header activeItem="comparison" />
      <div className="motel-comparison">
        <h1>모텔 비교</h1>

        {/* 검색 기능 */}
        <input
          type="text"
          placeholder="모텔 이름 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* 선택된 모텔 표시 (1개 이상 선택 시 표시) */}
        {selectedMotels.length > 0 && (
          <div className="selected-motels">
            <h2>선택된 모텔</h2>
            <div className="selected-motel-list">
              {selectedMotels.map((motel) => (
                <div
                  key={motel["업체명"]}
                  className="motel-item selected"
                  onClick={() => handleSelect(motel)}
                >
                  <img
                    src={`/image/${encodeURIComponent(motel["업체명"])}_1.jpg`}
                    alt={motel["업체명"]}
                    referrerPolicy="no-referrer"
                  />
                  <h2>{motel["업체명"]}</h2>
                  <p>{motel["주소"]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 모텔 리스트 */}
        <div className="motel-list">
          {currentMotels.map((motel, index) => {
            return (
              <div
                key={index}
                className={`motel-item ${
                  selectedMotels.some((m) => m["업체명"] === motel["업체명"])
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleSelect(motel)}
              >
                <img
                  src={`/image/${encodeURIComponent(motel["업체명"])}_1.jpg`}
                  alt={motel["업체명"]}
                  referrerPolicy="no-referrer"
                />
                <h2>{motel["업체명"]}</h2>
                <p>{motel["주소"]}</p>
              </div>
            );
          })}
        </div>

        {/* 페이지네이션 */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>

        {/* 비교 테이블 */}
        {selectedMotels.length === 2 && (
          <div className="comparison-table">
            <h2>비교 결과</h2>
            <table>
              <thead>
                <tr>
                  <th>항목</th>
                  <th>{selectedMotels[0]["업체명"]}</th>
                  <th>{selectedMotels[1]["업체명"]}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>주소</td>
                  <td>{selectedMotels[0]["주소"]}</td>
                  <td>{selectedMotels[1]["주소"]}</td>
                </tr>
                <tr>
                  <td>서비스</td>
                  <td>
                    {selectedMotels[0]["서비스"]?.join(", ") || "정보 없음"}
                  </td>
                  <td>
                    {selectedMotels[1]["서비스"]?.join(", ") || "정보 없음"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotelComparison;
