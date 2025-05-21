import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./header.css";

const Header = ({ activeItem }) => {
  const [tourDropdown, setTourDropdown] = useState(false);
  const [motelDropdown, setMotelDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="headerContainer">
        <div className="headerTop">
          {/* 메뉴 리스트 */}
          <div className="headerList">
            {/* 모텔 목록 (드롭다운) */}
            <div
              className={`headerListItem motelMenu ${
                activeItem === "stays" || activeItem === "stays-map"
                  ? "active"
                  : ""
              }`}
              onMouseEnter={() => setMotelDropdown(true)}
              onMouseLeave={() => setMotelDropdown(false)}
            >
              <img
                src={`${process.env.PUBLIC_URL}/icon/icon_list.svg`}
                className="icon"
                alt="list"
              />
              <span>모텔 목록</span>
              {motelDropdown && (
                <div className="motelDropdown">
                  <Link to="/motel" className="dropdownItem">
                    이름/주소로 검색
                  </Link>
                  <Link to="/motelmap" className="dropdownItem">
                    지도로 검색
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/motelcomparison"
              className={`headerListItem ${
                activeItem === "comparison" ? "active" : ""
              }`}
            >
              <img
                src={`${process.env.PUBLIC_URL}/icon/icon_scale.svg`}
                className="icon"
                alt="comparison"
              />
              <span>모텔 비교</span>
            </Link>

            <Link
              to="/aichatbot"
              className={`headerListItem ${
                activeItem === "AI" ? "active" : ""
              }`}
            >
              <img
                src={`${process.env.PUBLIC_URL}/icon/icon_AI.svg`}
                className="icon"
                alt="AI Chatbot"
              />
              <span>Ai 챗봇</span>
            </Link>

            {/* 관광 정보 (드롭다운) */}
            <div
              className={`headerListItem tourMenu ${
                activeItem === "tour" ? "active" : ""
              }`}
              onMouseEnter={() => setTourDropdown(true)}
              onMouseLeave={() => setTourDropdown(false)}
              onClick={() => navigate("/tourinfo")}
            >
              <img
                src={`${process.env.PUBLIC_URL}/icon/icon_tour.svg`}
                className="icon"
                alt="tour info"
              />
              <span>관광 정보</span>
              {tourDropdown && (
                <div className="tourDropdown">
                  <Link to="/tourinfo" className="dropdownItem">
                    이름으로 검색
                  </Link>
                  <Link to="/tourinfo/filter" className="dropdownItem">
                    지역 및 분류로 검색
                  </Link>
                  <Link
                    to="/plan/motel"
                    className="dropdownItem"
                    onClick={(e) => e.stopPropagation()}
                  >
                    여행 플랜 짜기
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
