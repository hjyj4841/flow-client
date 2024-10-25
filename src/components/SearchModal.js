import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../assets/css/SearchModal.css";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ isOpen, onClose, user = {} }) => {
  const navigate = useNavigate();
  const [heightRange, setHeightRange] = useState([
    user.heightMin || 140,
    user.heightMax || 200,
  ]);
  const [weightRange, setWeightRange] = useState([
    user.weightMin || 30,
    user.weightMax || 120,
  ]);
  const [gender, setGender] = useState(user.gender || "");
  const [job, setJob] = useState({
    사무직: false,
    연구직: false,
    공공직: false,
    의료직: false,
    엔터테인먼트: false,
    서비스직: false,
    영업직: false,
    건설직: false,
    생산직: false,
    농림어업직: false,
    기타: false,
  });
  const [season, setSeason] = useState({
    봄: false,
    여름: false,
    가을: false,
    겨울: false,
  });
  const [mood, setMood] = useState({
    포멀: false,
    캐주얼: false,
    스트릿: false,
    아메카지: false,
    빈티지: false,
    시티보이: false,
    페미닌: false,
    미니멀: false,
    스포티: false,
    톰보이: false,
    기타: false,
  });

  const handleSlider1Change = (value) => {
    setHeightRange(value);
  };

  const handleSlider2Change = (value) => {
    setWeightRange(value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleCheckboxChange = (setter, key) => {
    setter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = () => {
    const params = {
      heightMin: heightRange[0],
      heightMax: heightRange[1],
      weightMin: weightRange[0],
      weightMax: weightRange[1],
      job: Object.keys(job).filter((key) => job[key]),
      season: Object.keys(season).filter((key) => season[key]),
      mood: Object.keys(mood).filter((key) => mood[key]),
    };

    // gender가 선택되지 않은 경우 요청에서 제외
    if (gender) {
      params.gender = gender;
    } else {
      params.gender = "all"; // 기본값 설정
    }

    const queryParams = new URLSearchParams(params).toString();
    const url = `http://localhost:8080/api/tags/posts?${queryParams}`;

    console.log("Fetching from:", url); // 요청 URL 확인

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        // 데이터 처리 로직
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });

    navigate("/searched", { state: { params } });
    onClose();
  };

  const handleReset = () => {
    setHeightRange([user.heightMin || 140, user.heightMax || 200]);
    setWeightRange([user.weightMin || 30, user.weightMax || 120]);
    setGender(user.gender || "");
    setJob({
      사무직: false,
      연구직: false,
      공공직: false,
      의료직: false,
      엔터테인먼트: false,
      서비스직: false,
      영업직: false,
      건설직: false,
      생산직: false,
      농림어업직: false,
      기타: false,
    });
    setSeason({
      봄: false,
      여름: false,
      가을: false,
      겨울: false,
    });
    setMood({
      포멀: false,
      캐주얼: false,
      스트릿: false,
      아메카지: false,
      빈티지: false,
      시티보이: false,
      페미닌: false,
      미니멀: false,
      스포티: false,
      톰보이: false,
      기타: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <div>
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h1 className="text-xl font-bold">FILTER</h1>
            <button className="text-sm text-gray-500" onClick={handleReset}>
              초기화
            </button>
          </div>
          <div className="mb-4">
            <h2 className="section-title">HEIGHT</h2>
            <div className="flex justify-between items-center mb-2">
              <span>
                {heightRange[0]}cm ~ {heightRange[1]}cm
              </span>
            </div>
            <Slider
              range
              min={140}
              max={200}
              value={heightRange}
              onChange={handleSlider1Change}
              className="mb-4"
            />
          </div>
          <div className="mb-4">
            <h2 className="section-title">WEIGHT</h2>
            <div className="flex justify-between items-center mb-2">
              <span>
                {weightRange[0]}kg ~ {weightRange[1]}kg
              </span>
            </div>
            <Slider
              range
              min={30}
              max={120}
              value={weightRange}
              onChange={handleSlider2Change}
              className="mb-4"
            />
          </div>
          <div className="mb-4">
            <h2 className="section-title">GENDER</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">MEN</span>
              <input
                type="radio"
                name="gender"
                value="men"
                className="checkbox-input"
                checked={gender === "men"}
                onChange={handleGenderChange}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">WOMEN</span>
              <input
                type="radio"
                name="gender"
                value="women"
                className="checkbox-input"
                checked={gender === "women"}
                onChange={handleGenderChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <h2 className="section-title">JOB</h2>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(job).map((item) => (
                <label className="checkbox-label" key={item}>
                  <span>{item}</span>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={job[item]}
                    onChange={() => handleCheckboxChange(setJob, item)}
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="section-title">SEASON</h2>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(season).map((item) => (
                <label className="checkbox-label" key={item}>
                  <span>{item}</span>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={season[item]}
                    onChange={() => handleCheckboxChange(setSeason, item)}
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="section-title">MOOD</h2>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(mood).map((item) => (
                <label className="checkbox-label" key={item}>
                  <span>{item}</span>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={mood[item]}
                    onChange={() => handleCheckboxChange(setMood, item)}
                  />
                </label>
              ))}
            </div>
          </div>
          <button className="submit-button" onClick={handleSearch}>
            스타일 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
