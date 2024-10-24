import axios from "axios";

const auth = axios.create({
    baseURL : "http://localhost:8080/api/private/",
        // headers : {
            // Authorization : `Bearer ${localStorage.getItem("token")}`
        // }
});

export const addFollowRelative = async (follow) => {
    return await auth.post("follow", follow);
};

export const unfollow = async (followingUserCode, followerUserCode) => {
    return await auth.delete("follow", {
        params: {
            followingUserCode,
            followerUserCode,
        },
    });
}
;
export const viewMyFollower = async (followingUserCode, key) => {
    return await auth.get(`follow/myFollower/${followingUserCode}`, {
        params: {
            key: key  // key를 객체로 전달
        }
    });
};

export const followMeUsers = async (followerUserCode, key) => {
    return await auth.get(`follow/toMe/${followerUserCode}`, {
        params : {
            key : key
        }
    });
}



export const status = async (followingUserCode, followerUserCode) => {
    return await auth.get("follow/status", {
        params: {
            followingUserCode,
            followerUserCode
        }
    });
}