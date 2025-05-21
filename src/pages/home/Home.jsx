import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import "./home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;

    // sessionStorage에 저장
    sessionStorage.setItem("initialQuery", query);

    // 챗봇 페이지로 이동
    navigate("/aichatbot");
  };

  return (
    <div className="home">
      <Navbar />
      <Header />

      {/* 배경과 검색창을 포함한 Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1>AI 챗봇과 대화해보세요!</h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="챗봇에게 물어볼 내용을 입력하세요..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>시작하기</button>
          </div>
        </div>
      </div>

      
        <MailList />
        <Footer />
      
    </div>
  );
};

export default Home;
