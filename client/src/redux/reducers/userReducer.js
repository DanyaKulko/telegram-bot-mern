import {SET_BOT_RUNNING, SET_USER} from "../types/userTypes";

const initialState = {
    user: null,
    isLoggedIn: false,
    error: null,
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload.user,
                isLoggedIn: action.payload.isLoggedIn
            }

        case SET_BOT_RUNNING:
            return {
                ...state,
                user: {
                    ...state.user,
                    isBotRunning: action.payload
                }
            }
        default:
            return state
    }
}

export default userReducer