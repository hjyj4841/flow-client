import { useNavigate } from "react-router-dom";

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
      <body class="bg-gray-100">
        <div class="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
          <div class="flex justify-between items-center border-b pb-4 mb-4">
            <button class="text-xl font-bold" onClick={goMain}>
              ✕
            </button>
            <h1 class="text-xl font-bold">필터</h1>
            <button class="text-sm text-gray-500">초기화</button>
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
          <div class="mb-4">
            <h2 class="font-bold mb-2">HEIGHT</h2>
            <div class="flex justify-between items-center mb-2">
              <span>140cm ~ 195cm</span>
            </div>
            <input type="range" min="140" max="195" class="w-full" />
          </div>
          <div class="mb-4">
            <h2 class="font-bold mb-2">TPO</h2>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center">
                <span>바다 🏄‍♂️</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>여행 🏖️</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>캠퍼스 🎓</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>카페 ☕</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>데이트 💄</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>결혼식 👰</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>출근 👔</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>데일리 🥢</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
            </div>
          </div>
          <div class="mb-4">
            <h2 class="font-bold mb-2">SEASON</h2>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center">
                <span>봄 🌱</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>여름 ☀️</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>가을 🍂</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>겨울 ⛄</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
            </div>
          </div>
          <div class="mb-4">
            <h2 class="font-bold mb-2">MOOD</h2>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center">
                <span>미니멀</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>이지캐주얼</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>비즈니스캐주얼</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>아메카지</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>스트릿</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>시티보이</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>원마일웨어</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>스포티</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>유니크</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>레트로</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>러블리</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
              <label class="flex items-center">
                <span>모던캐주얼</span>
                <input type="checkbox" class="form-checkbox h-5 w-5 ml-2" />
              </label>
            </div>
          </div>
          <button class="w-full bg-black text-white py-3 rounded-lg font-bold">
            스타일 보기
          </button>
        </div>
      </body>
    </>
  );
};

export default Search;
