import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import "./tourinfo.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { getCategoryName } from "../../utils/fetchCategoryName";

const TOUR_TYPES = {
  전체: "",
  관광지: "A01", // 12
  문화시설: "A02", // 14
  "축제/공연/행사": "A03", // 15
  여행코스: "A04", // 25
  레포츠: "A05", // 28
  숙박: "A02", // 32 (숙박도 A02에 포함)
  쇼핑: "A06", // 38
  음식점: "A07", // 39
};

const Tourinfo = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [currentSearch, setCurrentSearch] = useState("서울");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedType, setSelectedType] = useState(""); // ✅ 관광타입 선택
  const [categoryNames, setCategoryNames] = useState({});
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_API_KEY;

  const fetchData = async (searchQuery, type) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${API_KEY}&keyword=${searchQuery}&MobileOS=ETC&MobileApp=AppTest&_type=json&numOfRows=1000${
          type ? `&cat1=${type}` : ""
        }`
      );
      setData(response.data.response.body.items.item || []);
      setCurrentSearch(searchQuery);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData("서울", selectedType);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      fetchData(query, selectedType);
      setCurrentSearch(query);
      setCurrentPage(0);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = data.slice(offset, offset + itemsPerPage);

  useEffect(() => {
    const fetchCategoryNamesForCurrentPage = async () => {
      const newCategoryNames = { ...categoryNames };
      const itemsToFetch = currentItems.filter(
        (item) =>
          item.cat1 &&
          item.cat2 &&
          item.cat3 &&
          !newCategoryNames[item.contentid]
      );

      if (itemsToFetch.length === 0) return;

      const fetchPromises = itemsToFetch.map(async (item) => {
        const name = await getCategoryName(item.cat1, item.cat2, item.cat3);
        newCategoryNames[item.contentid] = name;
      });

      await Promise.all(fetchPromises);
      setCategoryNames(newCategoryNames);
    };

    if (currentItems.length > 0) {
      fetchCategoryNamesForCurrentPage();
    }
  }, [currentItems]);

  return (
    <div>
      <Navbar />
      <Header activeItem="tour" />
      <div className="container">
        <h1>관광 정보 검색</h1>

        <div className="input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="지역명을 입력하세요"
          />

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {Object.entries(TOUR_TYPES).map(([label, code]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>

          <button onClick={handleSearch}>검색</button>
        </div>

        <p className="current-search">
          🔎 현재 검색: <strong>{currentSearch}</strong>
        </p>

        {loading ? (
          <p className="loading">로딩 중...</p>
        ) : (
          <>
            <div className="catalog">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div
                    key={item.contentid}
                    className="catalog-item"
                    onClick={() => navigate(`/tour/${item.contentid}`)}
                  >
                    <img
                      src={
                        item.firstimage
                          ? item.firstimage
                          : `${process.env.PUBLIC_URL}/img/default.png`
                      }
                      alt={item.title}
                      className="catalog-image"
                    />
                    <h2>{item.title}</h2>
                    <p className="category">
                      {categoryNames[item.contentid] || "불러오는 중..."}
                    </p>
                  </div>
                ))
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </div>

            <ReactPaginate
              previousLabel={"이전"}
              nextLabel={"다음"}
              breakLabel={"..."}
              pageCount={Math.ceil(data.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Tourinfo;
