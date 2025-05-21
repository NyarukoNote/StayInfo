import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./imageslider.css"; // CSS 파일을 따로 관리

const CustomPrevArrow = ({ onClick }) => (
  <button className="custom-arrow custom-prev" onClick={onClick}>
    ◀
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className="custom-arrow custom-next" onClick={onClick}>
    ▶
  </button>
);

const ImageSlider = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null); // 클릭된 이미지 상태 관리

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    adaptiveHeight: false,
    draggable: false,
    appendDots: (dots) => <div className="custom-dots-container">{dots}</div>,
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); // 이미지 클릭 시 큰 이미지로 설정
  };

  const handleCloseModal = () => {
    setSelectedImage(null); // 모달 닫기
  };

  return (
    <div className="motel-slider">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div
            key={index}
            className="slide-item"
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image}
              alt={`Motel Image ${index + 1}`}
              className="slide-image"
            />
          </div>
        ))}
      </Slider>

      {/* 모달 구현 */}
      {selectedImage && (
        <div className="image-modal" onClick={handleCloseModal}>
          <div className="image-modal-content">
            <img
              src={selectedImage}
              alt="Selected Motel"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
