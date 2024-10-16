const Update = () => {
  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md mt-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">FLOW</h1>
          <nav>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
              찾기
            </a>{" "}
            |
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
              회원 가입
            </a>{" "}
            |
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
              로그인
            </a>{" "}
            |
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
              마이페이지
            </a>
          </nav>
        </header>
        <form>
          <div className="mb-4">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>업로드할 게시판을 선택해주세요!</option>
            </select>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="제목"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <textarea
              id="content"
              class="w-full border border-gray-300 rounded px-3 py-2 h-32"
              placeholder="내용을 입력해 다른이들과 소통해보세요!"
              className="w-full p-2 border border-gray-300 rounded h-32"
            />
          </div>
          <div className="mb-4">
            <button
              type="button"
              className="w-full p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
            >
              사진 업로드
            </button>
            <input type="file" class="hidden" />
          </div>
          <div className="mb-4">
            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              <div>브랜드</div>
              <div>제품명</div>
              <div>제품 사이즈</div>
              <div>구매처</div>
              <div>구매 링크</div>
            </div>
            <button
              type="button"
              className="w-full p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 mt-2"
            >
              투표 추가하기
            </button>
          </div>
          <div className="mb-4">
            <div className="text-sm">
              <div className="mb-2">계절</div>
              <div>
                <label>
                  <input type="checkbox" className="mr-1" />봄
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  여름
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  가을
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  겨울
                </label>
              </div>
            </div>
            <div className="text-sm mt-4">
              <div className="mb-2">연차</div>
              <div>
                <label>
                  <input type="checkbox" className="mr-1" />
                  ~1년 미만
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  1~3년차
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  3년 이상
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  임원
                </label>
              </div>
            </div>
            <div className="text-sm mt-4">
              <div className="mb-2">스타일</div>
              <div>
                <label>
                  <input type="checkbox" className="mr-1" />
                  포멀
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  캐주얼
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  스트릿
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  아메카지
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  빈티지
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  시티보이
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  페미닌
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  미니멀
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  스포티
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  둠보이
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  기타
                </label>
              </div>
            </div>
            <div className="text-sm mt-4">
              <div className="mb-2">체형</div>
              <div>
                <label>
                  <input type="checkbox" className="mr-1" />
                  마름
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  보통
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  건장
                </label>
                <label>
                  <input type="checkbox" className="mr-1" />
                  빅사이즈
                </label>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-black text-white rounded hover:bg-gray-800"
            >
              업로드
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Update;
