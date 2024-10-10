import { viewMyFollower, followMeUsers } from "../../../api/follow";

export const initState = {
    myFollower : null,
    followMeUser : null
}

export const fetchFollowMeUsers = async (dispatch, followerUserCode) => {
    const response = await followMeUsers(followerUserCode);
    dispatch({type : "FETCH_FOLLOWMEUSERS", payload : response.data});
}

export const fetchViewMyFollower = async (dispatch, followingUserCode) => {
    const response = await viewMyFollower(followingUserCode);
    dispatch({type : "FETCH_MYFOLLOWER", payload : response.data});
}

export const followReducer = (state, action) => {
    switch(action.type) {
        case "FETCH_MYFOLLOWER" :
            return {...state, myFollower : action.payload};
        case "FETCH_FOLLOWMEUSERS" :
            return {...state, followMeUser : action.payload};
    }
}