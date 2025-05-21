import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./motelSelectPage.css";

const motelsPerPage = 5;

const MotelSelectPage = () => {
  const [motels, setMotels] = useState([]);
  const [selectedMotel, setSelectedMotel] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/data?fields=업체명,주소")
      .then((res) => {
        setMotels(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = async (name) => {
    try {
      const response = await axios.get(
        `/motel?name=${encodeURIComponent(name)}`
      );
      if (!response.data) throw new Error("해당 모텔을 찾을 수 없습니다.");
      setSelectedMotel({ name });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleNext = () => {
    if (!selectedMotel) return alert("모텔을 선택해주세요.");
    navigate("/plan/tour", { state: { name: selectedMotel.name } });
  };

  const offset = currentPage * motelsPerPage;
  const currentMotels = motels.slice(offset, offset + motelsPerPage);

  return (
    <div className="motel-page">
      <Navbar />
      <Header />

      <h1>여행 계획을 시작해보세요</h1>
      <h2>1. 숙소를 선택하세요</h2>

      <div className="motel-list">
        {currentMotels.map((motel) => {
          const name = motel["업체명"];
          const formattedName = name.replace(/ /g, "_");
          const isSelected = selectedMotel?.name === name;

          return (
            <div
              key={name}
              className={`motel-item ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelect(name)}
            >
              <img
                src={`/image/${encodeURIComponent(formattedName)}_1.jpg`}
                alt={name}
                referrerPolicy="no-referrer"
              />
              <h2>{name}</h2>
              <p>{motel["주소"]}</p>
              <p className="select-status">{isSelected ? "✅ 선택됨" : ""}</p>
            </div>
          );
        })}
      </div>

      <ReactPaginate
        previousLabel={"이전"}
        nextLabel={"다음"}
        breakLabel={"..."}
        pageCount={Math.ceil(motels.length / motelsPerPage)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={({ selected }) => setCurrentPage(selected)}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />

      <div className="selected-box">
        {selectedMotel && (
          <div>
            <strong>선택된 모텔:</strong> {selectedMotel.name}
          </div>
        )}
      </div>

      <button
        className="next-button"
        onClick={handleNext}
        disabled={!selectedMotel}
      >
        다음 (관광지 선택)
      </button>
    </div>
  );
};

export default MotelSelectPage;
