import {checkAuthRequest, loginRequest} from "../../http/userRequests";
import {SET_BOT_RUNNING, SET_USER} from "../types/userTypes";

export const userLogin = (payload) => dispatch => {
    return loginRequest(payload)
        .then(response => {
            localStorage.setItem('token', response.data.token);
            dispatch({
                type: SET_USER,
                payload: {user: response.data, isLoggedIn: true}
            })
        })
        .catch(error => {
            console.log(error.data)
        })
}

export const userLogout = () => dispatch => {
    localStorage.removeItem('token');
    dispatch({
        type: SET_USER,
        payload: {user: {}, isLoggedIn: false}
    })
}

export const checkAuth = () => dispatch => {
    return checkAuthRequest()
        .then(response => {
            dispatch({
                type: SET_USER,
                payload: {user: response.data.user, isLoggedIn: true}
            })
        })
        .catch(error => {
            console.log(error.data)
        })
}

export const setBotRunning = (payload) => dispatch => {
    dispatch({
        type: SET_BOT_RUNNING,
        payload: payload
    })
}

