import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import "./motelpage.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

const MotelPage = () => {
  const [motels, setMotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOption, setSortOption] = useState("이름순");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const motelsPerPage = 5;

  useEffect(() => {
    axios
      .get("/data?fields=업체명,주소,평가")
      .then((response) => {
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Invalid data format:", response.data);
          return;
        }
        setMotels(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getPositiveRatio = (evaluationArray) => {
    if (!Array.isArray(evaluationArray) || evaluationArray.length === 0)
      return 0;
    const positiveCount = evaluationArray.filter(
      (v) => v === "Positive"
    ).length;
    return positiveCount / evaluationArray.length;
  };

  // 주소에서 시/도만 추출 (예: "서울특별시", "경기도", ...)
  const extractRegion = (address) => {
    if (!address) return "";
    const match = address.match(/^[^\s]+[도|시]/); // 예: 서울특별시, 경상남도
    return match ? match[0] : "";
  };

  // 전체 모텔 데이터에서 시/도 목록 추출
  const uniqueRegions = [
    "전체",
    ...Array.from(
      new Set(
        motels
          .map((motel) => extractRegion(motel["주소"]))
          .filter((region) => region !== "")
      )
    ),
  ];

  // 검색어 & 지역 필터링
  const filteredMotels = motels.filter((motel) => {
    const name = motel["업체명"]?.toLowerCase() || "";
    const address = motel["주소"]?.toLowerCase() || "";
    const region = extractRegion(motel["주소"]);

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      address.includes(searchTerm.toLowerCase());

    const matchesRegion =
      selectedRegion === "전체" || region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  // 정렬
  const sortedMotels = [...filteredMotels].sort((a, b) => {
    if (sortOption === "이름순") {
      return a["업체명"].localeCompare(b["업체명"]);
    } else if (sortOption === "긍정도순") {
      return getPositiveRatio(b["평가"]) - getPositiveRatio(a["평가"]);
    }
    return 0;
  });

  // 페이지네이션
  const offset = currentPage * motelsPerPage;
  const currentMotels = sortedMotels.slice(offset, offset + motelsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(0);
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setCurrentPage(0);
  };

  return (
    <div>
      <Navbar />
      <Header activeItem="stays" />
      <div className="motel-page">
        <h1>모텔 목록</h1>

        {/* 검색, 정렬, 시도 필터 바 */}
        <div className="search-sort-bar">
          <select value={sortOption} onChange={handleSortChange}>
            <option value="이름순">이름순</option>
            <option value="긍정도순">긍정도 높은 순</option>
          </select>
          <select value={selectedRegion} onChange={handleRegionChange}>
            {uniqueRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="이름 또는 주소로 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* 모텔 리스트 */}
        <div className="motel-list">
          {currentMotels.map((motel) => {
            const formattedName = motel["업체명"].replace(/ /g, "_");
            const positiveRate = getPositiveRatio(motel["평가"]);

            return (
              <Link
                to={`/motel/${encodeURIComponent(motel["업체명"])}`}
                key={motel["업체명"]}
              >
                <div className="motel-item">
                  <img
                    src={`/image/${encodeURIComponent(formattedName)}_1.jpg`}
                    alt={motel["업체명"]}
                    referrerPolicy="no-referrer"
                  />
                  <h2>{motel["업체명"]}</h2>
                  <p>{motel["주소"]}</p>
                  <p>긍정도: {(positiveRate * 100).toFixed(1)}%</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 페이지네이션 */}
        <ReactPaginate
          previousLabel={"이전"}
          nextLabel={"다음"}
          breakLabel={"..."}
          pageCount={Math.ceil(sortedMotels.length / motelsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default MotelPage;
