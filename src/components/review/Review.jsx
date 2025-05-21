import React from "react";
import "./review.css";

const Review = ({ comment, sentiment, filter }) => {
  // 필터가 존재하고 sentiment가 필터와 일치하지 않으면 해당 리뷰는 렌더링하지 않음
  if (filter === "Positive") {
    return (
      <div className="review-card">
        <p className="review-comment">"{comment}"</p>
        <p className="positive">👍 긍정적 리뷰</p>
      </div>
    );
  }

  if (filter === "Neutral") {
    return (
      <div className="review-card">
        <p className="review-comment">"{comment}"</p>
        <p className="neutral">🤝 중립적 리뷰</p>
      </div>
    );
  }

  if (filter === "Negative") {
    return (
      <div className="review-card">
        <p className="review-comment">"{comment}"</p>
        <p className="negative">👎 부정적 리뷰</p>
      </div>
    );
  }

  return (
    <div className="review-card">
      <p className="review-comment">"{comment}"</p>
      <div className="review-sentiment">
        {sentiment === "Positive" ? (
          <p className="positive">👍 긍정적 리뷰</p>
        ) : sentiment === "Negative" ? (
          <p className="negative">👎 부정적 리뷰</p>
        ) : sentiment === "Neutral" ? (
          <p className="neutral">🤝 중립적 리뷰</p>
        ) : (
          <p>🔍 분석되지 않음</p>
        )}
      </div>
    </div>
  );
};

export default Review;
