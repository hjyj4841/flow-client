import { useState, useEffect } from "react";
import { addFollowRelative, unfollow, status } from "../../api/follow";

const FollowButton = ({user, codeName}) => {
    const token = localStorage.getItem("token");
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
    const [follow, setFollow] = useState({
        followingUser : {
            userCode : codeName === "followingUserCode" ? tokenCode : user.userCode
        },
        followerUser : {
            userCode :  codeName === "followerUserCode" ? tokenCode : user.userCode
        }
    });
    const [logic, setLogic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const result = async () => {
        if (follow.followingUser.userCode !== 0 && follow.followerUser.userCode !== 0) {
            try {
                if (!logic) {
                    await addFollowRelative(setFollow({
                        followingUser : {
                            userCode : codeName === "followingUserCode" ? tokenCode : user.userCode
                        },
                        followerUser : {
                            userCode :  codeName === "followerUserCode" ? tokenCode : user.userCode
                        }
                    }));
                } else {
                    await unfollow(
                        follow.followingUser.userCode,
                        follow.followerUser.userCode
                    );
                }
                setLogic(!logic);
            } catch (error) {
                console.error("팔로우 상태 변경 중 오류 발생:", error);
            }
        }
    }
    useEffect(() => {
            const fetchFollowStatus = async () => {
            setIsLoading(true);
            try {
                const response = await status(
                    follow.followingUser.userCode,
                    follow.followerUser.userCode
                );
                if(response.data !== logic)
                setLogic(response.data);
            } catch (error) {
                console.error("팔로우 상태를 가져오는 중 오류 발생:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFollowStatus();
    } , []);
    return <>
        <button onClick={result}>{logic ? "unfollow" : "follow"}</button>
    </>
}
export default FollowButton;