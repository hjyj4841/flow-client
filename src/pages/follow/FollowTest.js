import { useState, useEffect } from "react";
import { addFollowRelative, unfollow, status } from "../../api/follow";

const FollowTest = () => {
    const [follow, setFollow] = useState({
        followingUser : {
            userCode : 2
        },
        followerUser : {
            userCode : 5
        }
    });
    const [logic, setLogic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const result = async () => {
        if (follow.followingUser.userCode !== 0 && follow.followerUser.userCode !== 0) {
            try {
                if (!logic) {
                    await addFollowRelative(follow);
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
                console.log(response.data);
                setLogic(response.data);
            } catch (error) {
                console.error("팔로우 상태를 가져오는 중 오류 발생:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFollowStatus();
    } , [logic]);
    return <>
        <h1>follow - test</h1>
        <button onClick={result}>{logic ? "unfollow" : "follow"}</button>
    </>
}
export default FollowTest;