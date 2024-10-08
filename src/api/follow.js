import axios from "axios";

const instance = axios.create({
    baseURL : "http://localhost:8080/api/",
});

export const viewMyFollower = async (followingUserCode) => {
    return await instance.get(`follow/myFollower/${followingUserCode}`);
}

export const followMeUsers = async (followerUserCode) => {
    return await instance.get(`follow/toMe/${followerUserCode}`);
}

export const addFollowRelative = async (follow) => {
    return await instance.post("follow", follow);
};

export const unfollow = async (followingUserCode, followerUserCode) => {
    return await instance.delete("follow", {
        params: {
            followingUserCode,
            followerUserCode,
        },
    });
}

export const status = async (followingUserCode, followerUserCode) => {
    return await instance.get("follow/status", {
        params: {
            followingUserCode,
            followerUserCode
        }
    });
}