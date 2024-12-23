import { useParams} from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useCallback, useEffect} from "react";
import "../../assets/css/MyFollower.modules.css"
import FollowingPage from "./FollowingPage";
import FollowerPage from "./FollowerPage";
import { useRef } from "react";

const MyFollower = ({setIsModalOpen, isModalOpen, logic}) => {
  const { mypageUserCode } = useParams();
  const count = useSelector((state) => state.follow.countFollower);
  const counter = useSelector((state) => state.follow.counter);
  const [bool, setBool] = useState(logic);
  const [key, setKey] = useState("");
  const [keyword, setKeyword] = useState("");
  const [position, setPosition] = useState({ x: -250, y: -180 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const scrollRefbyFollowing = useRef();
  const scrollRefbyFollower = useRef();

  const warp1 = useCallback(() => {
    setBool(true);
  }, []);

  const warp2 = useCallback(() => {
    setBool(false);
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest(".searchBar") || e.target.closest(".following-users") || e.target.closest("header")) {
      return; // 드래그 기능을 비활성화
  }
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
      document.body.style.userSelect = "auto";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  useEffect(() => {
    const encodedKey = encodeURIComponent(key);
    setKeyword(encodedKey);
  },[key]);
  return (
    <>
      {isModalOpen && (
          <div className="myfollower-modal-content"
          onMouseDown={handleMouseDown} 
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`, // 위치를 translate로 제어
          }}
          >
            <button className="followModal-close-button" onClick={() => {
              setIsModalOpen(false);
              setBool(logic);
              setKey("");
              }}
              >✕</button>
              <div className="imageBar"></div>
            <div className="following-userInfo">
              <header>
                <div className={`section ${bool ? 'active' : ''}`} onClick={warp1}>
                  <h1>팔로잉</h1>
                  <p>{count}</p>
                </div>
                <div id="center-section" className={`section ${!bool ? 'active' : ''}`} onClick={warp2}>
                  <h1>팔로워</h1>
                  <p>{counter}</p>
                </div>
              </header>
              <div className="searchBar">
                <input
                  type="text"
                  placeholder="검색"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
              </div>
              <div className="following-users">
                <div className="scroll" ref={scrollRefbyFollowing} style={{ display: bool ? 'flex' : 'none', flexDirection: 'column' }}>
                  <FollowingPage followingUserCode={mypageUserCode} search={keyword} bool={bool} scrollRefbyFollowing={scrollRefbyFollowing}/>
                </div>
                <div className="scroll" ref={scrollRefbyFollower} style={{ display: !bool ? 'flex' : 'none', flexDirection: 'column' }}>
                  <FollowerPage followingUserCode={mypageUserCode} search={keyword} bool={bool} scrollRefbyFollower={scrollRefbyFollower}/>
                </div>
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default MyFollower;