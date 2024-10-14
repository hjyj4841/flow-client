import { useEffect, useState } from "react";
import { createFollowRelative, removeFollowRelative, followStatus } from "../../store/followSlice";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const FollowButton = ({user}) => {

    const FollowStyleAndEffect = styled.body`
        button {
            background-color: green;
            width: 4rem;
            height: 3rem;
            border: 1px, solid, beige;
            cursor: pointer;
        }
        
    `;

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
        <FollowStyleAndEffect onClick={submit}>
            <button onClick={submit}>{isFollow ? "언팔로우" : "팔로우"}</button>
        </FollowStyleAndEffect>
    </>
}
export default FollowButton;