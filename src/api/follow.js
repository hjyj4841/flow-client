import axios from "axios";

const auth = axios.create({
    baseURL : "http://localhost:8080/api/private/",
        // headers : {
            // Authorization : `Bearer ${localStorage.getItem("token")}`
        // }
});

export const addFollowRelative = async (follow) => {
    return await auth.post("follow", {
        followingUser : {
            userCode: follow.followingUser.userCode
        },
        followerUser: {
            userCode: follow.followerUser.userCode
        }
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
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
export const viewMyFollower = async (followingUserCode) => {
    return await auth.get(`follow/myFollower/${followingUserCode}`);
}

export const followMeUsers = async (followerUserCode) => {
    return await auth.get(`follow/toMe/${followerUserCode}`);
}



export const status = async (followingUserCode, followerUserCode) => {
    return await auth.get("follow/status", {
        params: {
            followingUserCode,
            followerUserCode
        }
    });
}