import { useState, useEffect } from "react";
import { addFollowRelative, unfollow } from "../../api/follow";

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
    useEffect(() => {
        const fetchFollowStatus = async () => {
            
        }
    }, []);
    const result = async () => {
        if (follow.followingUser.userCode !== 0 && follow.followerUser.userCode !== 0) {
            if(!logic) {
                await addFollowRelative(follow);
                setLogic(!logic); 
            }
            else {
                await unfollow(follow.followingUser.userCode, follow.followerUser.userCode);
                setLogic(!logic); 
            }
        }
    };
    return <>
        <h1>follow - test</h1>
        <button onClick={result}>{logic ? "unfollow" : "follow"}</button>
    </>
}
export default FollowTest;