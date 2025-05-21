import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MapComponent from "../../components/map/MapComponent";
import ImageSlider from "../../components/imageslider/ImageSlider";
import Review from "../../components/review/Review";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "./moteldetailpage.css";
import yeogiImage from "../../asset/yeogi.png";
import naverImage from "../../asset/naver.png";

const MotelDetailPage = () => {
  const { name } = useParams();
  const [motel, setMotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    const fetchMotelData = async () => {
      console.log("Fetching data for motel:", name);
      try {
        const response = await axios.get(
          `/motel?name=${encodeURIComponent(name)}`
        );
        if (!response.data) throw new Error("해당 모텔을 찾을 수 없습니다.");
        console.log(response.data);
        setMotel(response.data);

        const imageListResponse = await axios.get(
          `/image_list/${encodeURIComponent(name)}`
        );
        if (
          Array.isArray(imageListResponse.data.images) &&
          imageListResponse.data.images.length > 0
        ) {
          const imageUrls = imageListResponse.data.images.map(
            (filename) => `/images/${filename}`
          );
          setImages(imageUrls);
        } else {
          setImages([
            `/images/${encodeURIComponent(name)}.jpg`,
            "/img/default.png",
          ]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMotelData();
  }, [name]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (!motel) return <div>모텔 정보가 없습니다.</div>;

  const reviews = Array.isArray(motel["리뷰"]) ? motel["리뷰"] : [];
  const evaluations = Array.isArray(motel["평가"]) ? motel["평가"] : [];

  const positiveCount = evaluations.filter((e) => e === "Positive").length;
  const negativeCount = evaluations.filter((e) => e === "Negative").length;
  const neutralCount = evaluations.filter((e) => e === "Neutral").length;
  const totalReviews = evaluations.length || 1;

  const positivePercentage = (positiveCount / totalReviews) * 100;
  const negativePercentage = (negativeCount / totalReviews) * 100;
  const neutralPercentage = (neutralCount / totalReviews) * 100;

  const chartData = {
    labels: ["긍정적 리뷰", "부정적 리뷰", "중립적 리뷰"],
    datasets: [
      {
        data: [positivePercentage, negativePercentage, neutralPercentage],
        backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"],
        borderColor: ["#4caf50", "#f44336", "#ffeb3b"],
        borderWidth: 1,
      },
    ],
  };

  const detailedPositiveData = {
    labels: ["안전", "시설만족", "위생", "재방문 의사", "접근성", "서비스"],
    datasets: [
      {
        label: "긍정 비율 (%)",
        data: [
          (motel["안전_긍정비율"] || 0) * 100,
          (motel["시설만족_긍정비율"] || 0) * 100,
          (motel["위생_긍정비율"] || 0) * 100,
          (motel["재방문_긍정비율"] || 0) * 100,
          (motel["접근성_긍정비율"] || 0) * 100,
          (motel["서비스_긍정비율"] || 0) * 100,
        ],
        backgroundColor: "#4caf50",
      },
    ],
  };

  const filteredReviews = reviews.filter((_, index) => {
    if (filter === null) return true;
    return evaluations[index] === filter;
  });

  const displayedReviews = showAllReviews
    ? filteredReviews
    : filteredReviews.slice(0, 3);

  const accommodationInfo = motel["숙소이용정보"] || [];

  return (
    <div>
      <Navbar />
      <Header activeItem="stays" />
      <div className="motel-detail-page">
        <h1>{motel["업체명"]}</h1>
        <p className="motel-address">{motel["주소"]}</p>

        <div className="motel-images">
          <ImageSlider images={images} />
        </div>

        <div className="motel-description">
          <h2>모텔 소개</h2>
          <p>{motel["숙소소개"] || "소개 정보가 없습니다."}</p>
        </div>

        <div className="motel-accommodation-info">
          <h2>숙소 이용 정보</h2>
          {accommodationInfo.length > 0 ? (
            accommodationInfo.map((info, index) => (
              <div key={index} className="accommodation-info-category">
                <h3>{info["카테고리"]}</h3>
                <ul>
                  {info["내용"].map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>숙소 이용 정보가 없습니다.</p>
          )}
        </div>

        {Array.isArray(motel["서비스"]) && motel["서비스"].length > 0 && (
          <div className="motel-services">
            <h2>제공 서비스</h2>
            <div className="service-tags">
              {motel["서비스"].map((service, index) => (
                <span key={index} className="service-tag">
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 리뷰 요약 */}
        <div className="review-stats">
          <h2>리뷰 요약</h2>

          {/* 장점/단점 */}
          <div className="motel-pros-cons">
            <h2>한줄 요약</h2>
            <p>
              <strong>장점:</strong> {motel["장점"] || "정보 없음"}
            </p>
            <p>
              <strong>단점:</strong> {motel["단점"] || "정보 없음"}
            </p>
          </div>

          <div className="review-stats">
            <h2>리뷰 요약</h2>
            <div className="review-stats-flex">
              {/* 원형 그래프 (리뷰 평가 비율) */}
              <div className="review-circle">
                <h3>리뷰 평가 비율</h3>
                <Doughnut data={chartData} />
                <div className="review-percentage">
                  <p>
                    <strong>긍정적 리뷰:</strong>{" "}
                    {chartData.datasets[0].data[0].toFixed(2)}%
                  </p>
                  <p>
                    <strong>부정적 리뷰:</strong>{" "}
                    {chartData.datasets[0].data[1].toFixed(2)}%
                  </p>
                  <p>
                    <strong>중립적 리뷰:</strong>{" "}
                    {chartData.datasets[0].data[2].toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* 막대 그래프 (6가지 항목) */}
              <div className="review-detail-bar">
                <h3>세부 항목 긍정 비율</h3>
                <Bar
                  data={detailedPositiveData}
                  options={{
                    indexAxis: "y",
                    scales: {
                      x: {
                        min: 0,
                        max: 100,
                        ticks: {
                          callback: (val) => `${val}%`,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div>
          <div className="reviews-header">
            <h2>리뷰</h2>
            <div>
              <button onClick={() => setFilter(null)}>전체</button>
              <button onClick={() => setFilter("Positive")}>긍정적 리뷰</button>
              <button onClick={() => setFilter("Neutral")}>중립적 리뷰</button>
              <button onClick={() => setFilter("Negative")}>부정적 리뷰</button>
            </div>
          </div>

          <div className="reviews-list">
            {displayedReviews.map((comment, index) => (
              <Review
                key={index}
                comment={comment}
                sentiment={evaluations[index]}
                filter={filter}
              />
            ))}
          </div>

          <div className="toggle-reviews">
            <button onClick={() => setShowAllReviews(!showAllReviews)}>
              {showAllReviews ? "리뷰 숨기기" : "모든 리뷰 보기"}
            </button>
          </div>
        </div>

        {/* 외부 링크 */}
        <div className="motel-links">
          <h2>더 많은 정보</h2>
          {motel["네이버"] && motel["네이버"].trim() && (
            <button
              className="naver-button"
              onClick={() => window.open(motel["네이버"], "_blank")}
            >
              <img src={naverImage} alt="네이버" /> 네이버 플레이스에서 보기
            </button>
          )}
          {motel["여기어때"] && motel["여기어때"].trim() && (
            <button
              className="yeogi-button"
              onClick={() => window.open(motel["여기어때"], "_blank")}
            >
              <img src={yeogiImage} alt="여기어때" />
              여기어때에서 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotelDetailPage;
