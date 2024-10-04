import axios from "axios";

const instance = axios.create({
    baseURL : "http://localhost:8080/api/follow/"
});

export const viewMyFollower = async (myFollwer) => {
    return await instance.get("viewMyFollower", myFollwer);
}

export const followMeUsers = async (followMe) => {
    return await instance.get("followMeUsers", followMe);
}

export const addFollowRelative = async (newRelative) => {
    return await instance.post("addFollowRelative", newRelative);
}

export const unfollow = async (deleteRelative) => {
    return await instance.delete("unfollow", deleteRelative);
}