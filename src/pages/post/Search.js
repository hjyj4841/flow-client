import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Search = () => {
  const navigate = useNavigate();

  const goMain = () => {
    navigate("/");
  };

  const [minHeight, setMinHeight] = useState(140);
  const [maxHeight, setMaxHeight] = useState(220);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxHeight);
    setMinHeight(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minHeight);
    setMaxHeight(value);
  };

  return (
    <>
      <body className="bg-gray-100">
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <button className="text-xl font-bold" onClick={goMain}>
              ✕
            </button>
            <h1 className="text-xl font-bold">필터</h1>
            <button className="text-sm text-gray-500">초기화</button>
          </div>
          <div className="mb-8">
            <h2 className="font-bold mb-2">HEIGHT</h2>
            <div className="flex justify-between items-center mb-2">
              <span>
                {minHeight}cm ~ {maxHeight}cm
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="140"
                max="220"
                value={minHeight}
                onChange={handleMinChange}
                className="absolute w-full z-10"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">MEN</span>
              <input type="checkbox" className="form-checkbox h-5 w-5" />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">WOMEN</span>
              <input type="checkbox" className="form-checkbox h-5 w-5" />
            </div>
          </div>
          <div className="mb-4">
            <h2 className="font-bold mb-2">TPO</h2>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                <span>바다 🏄‍♂️</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>여행 🏖️</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>캠퍼스 🎓</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>카페 ☕</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>데이트 💄</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>결혼식 👰</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>출근 👔</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>데일리 🥢</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="font-bold mb-2">SEASON</h2>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                <span>봄 🌱</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>여름 ☀️</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>가을 🍂</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>겨울 ⛄</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="font-bold mb-2">MOOD</h2>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                <span>미니멀</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>이지캐주얼</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>비즈니스캐주얼</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>아메카지</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>스트릿</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>시티보이</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>원마일웨어</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>스포티</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>유니크</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>레트로</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>러블리</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label className="flex items-center">
                <span>모던캐주얼</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 ml-2" />
              </label>
            </div>
          </div>
          <button className="w-full bg-black text-white py-3 rounded-lg font-bold">
            스타일 보기
          </button>
        </div>
      </body>
    </>
  );
};

export default Search;
