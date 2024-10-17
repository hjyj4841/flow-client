import { useEffect, useState } from "react";
import { createFollowRelative, removeFollowRelative, followStatus } from "../../store/followSlice";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const FollowButton = ({user}) => {
    const FollowStyleAndEffect = styled.div`
        button {
            color: #4a4a4a;
            margin: 1px;
            width: 6rem;
            height: 3rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            background-color:  #e1bee7;
            box-shadow: inset -1px 1px 2px rgba(223, 205, 237, 0.8);
            font-size: 1.2rem; /* 글자 크기 */
            font-weight: 500; /* 글자 굵기 */
            font-family: 'Poppins', sans-serif; /* 세련된 글꼴 */
        }
        
    `;
        // Google Fonts를 동적으로 로드하는 useEffect 훅
        useEffect(() => {
          const link = document.createElement('link');
          link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap';
          link.rel = 'stylesheet';
          document.head.appendChild(link); // <head>에 추가
        }, []);

    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    function parseJwt(token) {
        const base64Url = token.split('.')[1];  // 토큰의 두 번째 부분 (Payload)
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);  // JSON 형태로 반환
    }
    const decodedPayload = parseJwt(token);
    const tokenCode = decodedPayload.userCode;
    const [follow,setFollow] = useState({
        followingUser : {
            userCode : tokenCode
        },
        followerUser : {
            userCode : user.userCode
        }
    });
    const [isFollow, setIsFollow] = useState(false);
    const addFollowRelative = () => {
        dispatch(createFollowRelative(follow));
        setIsFollow(true);
    }
    const unfollow = () => {
        dispatch(removeFollowRelative({
            followingUserCode : follow.followingUser.userCode, 
            followerUserCode : follow.followerUser.userCode
        }));
        setIsFollow(false);
    }

    const submit = () => {
        if(!isFollow) {
            addFollowRelative();
        } else {
            unfollow();
        }
    }
    useEffect(() => {
        dispatch(followStatus({
            followingUserCode : tokenCode,
            followerUserCode : user.userCode
        })).then((response) => {
            const status = response.payload;
            setIsFollow(status);
        })
    }, [tokenCode, user.userCode, dispatch])
    return <>
        <FollowStyleAndEffect>
            <button onClick={submit}>{isFollow ? "언팔로우" : "팔로우"}</button>
        </FollowStyleAndEffect>
    </>
}
export default FollowButton;