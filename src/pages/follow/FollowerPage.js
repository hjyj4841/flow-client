
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { followMe} from "../../store/followSlice";
import { useEffect, useState, useCallback, useMemo} from "react";
import "../../assets/css/MyFollower.modules.css"
import { useAuth } from "../../contexts/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";

const FollowerPage = React.memo(({followingUserCode, search, bool, scrollRefbyFollower}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const followee = useSelector((state) => state.follow.followee);
    const {token} = useAuth();
    const [code, setCode] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
      if (token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const userData = JSON.parse(window.atob(base64));
        setCode(userData.userCode);
      }
    }, [token]); // 의존성 배열 추가

      const fetchFollowers = useCallback(() => {
        if(followingUserCode !== undefined) {
          dispatch(followMe({
            followerUserCode : followingUserCode,
            key : search
          }));
        }
      }, [dispatch, search]);
    
      // Redux 액션을 디스패치하는 useEffect
      useEffect(() => {
        fetchFollowers();
      }, [fetchFollowers, search, bool]);

      useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollRefbyFollower.current;
            if (scrollTop + clientHeight >= scrollHeight - 100) { // 스크롤이 끝에 도달했을 때
                setCurrentPage((prevPage) => prevPage + 1);
            }
        };

        const scrollElement = scrollRefbyFollower.current;
        scrollElement.addEventListener("scroll", handleScroll);

        return () => scrollElement.removeEventListener("scroll", handleScroll);
    }, [scrollRefbyFollower]);

    const paginatedItems = useMemo(() => {
      return followee.slice(0, currentPage * itemsPerPage);
  }, [followee, currentPage]);

      const userList = 
      useMemo(
        () =>
          paginatedItems.map((dto, index) => (
            <div className="userSection" key={index}
            onClick={() => {
              navigate(`/mypage/${dto.user.userCode}`);
            }}
            >
              <img src={dto.user.userProfileUrl} alt={dto.user.userNickname} />
              <div className="infoBox">
                <div className="nickBox">{dto.user.userNickname}</div>
                <div className="etcBox">{dto.user.userEmail}</div>
              </div>
              <div className="buttonContainer">
                  {(code !== dto.user.userCode && dto.following !== undefined) && (
                   <FollowButton user={dto.user} key={dto.user.userCode} bool={dto.following} />
                  )}
                </div>
            </div>
          )),
        [paginatedItems, currentPage]
      );
    return (
      <>
          {userList}
      </>
    );
  });

export default FollowerPage;