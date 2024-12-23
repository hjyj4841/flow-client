import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../assets/css/SearchModal.css";
import { useNavigate } from "react-router-dom";

const seasonTagMap = {
  봄: 1,
  여름: 2,
  가을: 3,
  겨울: 4,
};

const careerTagMap = {
  "~1년 미만": 5,
  "1~3년차": 6,
  "3년 이상": 7,
  임원급: 8,
};

const moodTagMap = {
  포멀: 9,
  캐주얼: 10,
  스트릿: 11,
  아메카지: 12,
  빈티지: 13,
  시티보이: 14,
  페미닌: 15,
  미니멀: 16,
  스포티: 17,
  톰보이: 18,
  기타: 19,
};

const bodyTypeMap = {
  마름: 20,
  보통: 21,
  건장: 22,
  빅사이즈: 23,
};

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
  const [career, setCareer] = useState({
    "~1년 미만": false,
    "1~3년차": false,
    "3년 이상": false,
    임원급: false,
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
  const [bodyType, setBodyType] = useState({
    마름: false,
    보통: false,
    건장: false,
    빅사이즈: false,
  });

  const handleSliderChange = (setter) => (value) => {
    setter(value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleCheckboxChange = (setter, key) => {
    setter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = () => {
    const seasonTags = Object.keys(season)
      .filter((key) => season[key])
      .map((seasonKey) => seasonTagMap[seasonKey]);

    const careerTags = Object.keys(career)
      .filter((key) => career[key])
      .map((careerKey) => careerTagMap[careerKey]);

    const moodTags = Object.keys(mood)
      .filter((key) => mood[key])
      .map((moodKey) => moodTagMap[moodKey]);

    const bodyTypeTags = Object.keys(bodyType)
      .filter((key) => bodyType[key])
      .map((bodyTypeKey) => bodyTypeMap[bodyTypeKey]);

    const allTags = [
      ...seasonTags,
      ...careerTags,
      ...moodTags,
      ...bodyTypeTags,
    ];

    const selectedJobs = Object.keys(job).filter((key) => job[key]);

    const params = {
      userJob: selectedJobs,
      userGender: gender || undefined,
      userHeightMin: heightRange[0],
      userHeightMax: heightRange[1],
      userWeightMin: weightRange[0],
      userWeightMax: weightRange[1],
      tagCode: allTags.length > 0 ? allTags : undefined,
    };

    if (
      selectedJobs.length === 0 &&
      !gender &&
      allTags.length === 0 &&
      heightRange[0] === 140 &&
      heightRange[1] === 200 &&
      weightRange[0] === 30 &&
      weightRange[1] === 120
    ) {
      alert("최소한 하나 이상의 필터 조건을 선택해야 합니다.");
      return;
    }

    Object.keys(params).forEach((key) => {
      if (Array.isArray(params[key]) && params[key].length === 0) {
        delete params[key];
      } else if (params[key] === undefined) {
        delete params[key];
      }
    });

    console.log("Search params:", params);

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
    setSeason({ 봄: false, 여름: false, 가을: false, 겨울: false });
    setCareer({
      "~1년 미만": false,
      "1~3년차": false,
      "3년 이상": false,
      임원급: false,
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
    setBodyType({ 마름: false, 보통: false, 건장: false, 빅사이즈: false });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <div>
          <div className="modal-header">
            <h1 className="filter-title">FILTER</h1>
            <button className="reset-button" onClick={handleReset}>
              초기화
            </button>
          </div>
          {/* HEIGHT 필터 */}
          <div className="filter-section">
            <h2 className="section-title">HEIGHT</h2>
            <div className="range-display">
              <span className="range-title">
                {heightRange[0]}cm ~ {heightRange[1]}cm
              </span>
            </div>
            <Slider
              range
              min={140}
              max={200}
              value={heightRange}
              onChange={handleSliderChange(setHeightRange)}
              className="slider"
            />
          </div>
          {/* WEIGHT 필터 */}
          <div className="filter-section">
            <h2 className="section-title">WEIGHT</h2>
            <div className="range-display">
              <span className="range-title">
                {weightRange[0]}kg ~ {weightRange[1]}kg
              </span>
            </div>
            <Slider
              range
              min={30}
              max={120}
              value={weightRange}
              onChange={handleSliderChange(setWeightRange)}
              className="slider"
            />
          </div>
          {/* GENDER 필터 */}
          <div className="filter-section">
            <h2 className="section-title">GENDER</h2>
            <div className="radio-group">
              <span className="gender-title">MEN</span>
              <input
                type="radio"
                name="gender"
                value="남성"
                className="checkbox-input"
                checked={gender === "남성"}
                onChange={handleGenderChange}
              />
            </div>
            <div className="radio-group">
              <span className="gender-title">WOMEN</span>
              <input
                type="radio"
                name="gender"
                value="여성"
                className="checkbox-input"
                checked={gender === "여성"}
                onChange={handleGenderChange}
              />
            </div>
          </div>
          {/* JOB 필터 */}
          <div className="filter-section">
            <h2 className="section-title">JOB</h2>
            <div className="checkbox-group">
              {Object.keys(job).map((item) => (
                <label className="checkbox-label" key={item}>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={job[item]}
                    onChange={() => handleCheckboxChange(setJob, item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
          {/* SEASON 필터 */}
          <div className="filter-section">
            <h2 className="section-title">SEASON</h2>
            <div className="checkbox-group">
              {Object.keys(season).map((item) => (
                <label className="checkbox-label" key={item}>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={season[item]}
                    onChange={() => handleCheckboxChange(setSeason, item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
          {/* CAREER 필터 */}
          <div className="filter-section">
            <h2 className="section-title">CAREER</h2>
            <div className="checkbox-group">
              {Object.keys(career).map((item) => (
                <label className="checkbox-label" key={item}>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={career[item]}
                    onChange={() => handleCheckboxChange(setCareer, item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
          {/* MOOD 필터 */}
          <div className="filter-section">
            <h2 className="section-title">MOOD</h2>
            <div className="checkbox-group">
              {Object.keys(mood).map((item) => (
                <label className="checkbox-label" key={item}>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={mood[item]}
                    onChange={() => handleCheckboxChange(setMood, item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
          {/* BODY TYPE 필터 */}
          <div className="filter-section">
            <h2 className="section-title">BODY TYPE</h2>
            <div className="checkbox-group">
              {Object.keys(bodyType).map((item) => (
                <label className="checkbox-label" key={item}>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={bodyType[item]}
                    onChange={() => handleCheckboxChange(setBodyType, item)}
                  />
                  <span>{item}</span>
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
