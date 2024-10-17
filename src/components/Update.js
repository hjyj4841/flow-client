const Update = () => {
  return (
    <>
      <div class="max-w-2xl mx-auto p-6 bg-white shadow-md mt-10 rounded-lg">
        <form>
          <div class="mb-4">
            <label for="board" class="block text-sm font-medium mb-2">
              업로드할 게시판을 선택해주세요!
            </label>
            <select
              id="board"
              class="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>게시판 1</option>
              <option>게시판 2</option>
              <option>게시판 3</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              class="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="제목을 입력하세요"
            />
          </div>
          <div class="mb-4">
            <label for="content" class="block text-sm font-medium mb-2">
              내용
            </label>
            <textarea
              id="content"
              class="w-full border border-gray-300 rounded px-3 py-2 h-32"
              placeholder="내용을 입력해 다른이들과 소통해보세요!"
            ></textarea>
          </div>
          <div class="mb-4 flex items-center">
            <button
              type="button"
              class="border border-dashed border-gray-300 rounded px-4 py-2 mr-4"
            >
              사진 업로드
            </button>
            <input type="file" class="hidden" />
          </div>
          <div class="mb-4">
            <button
              type="button"
              class="w-full border border-gray-300 rounded px-3 py-2"
            >
              투표 추가하기
            </button>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 text-white rounded px-4 py-2"
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