import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {auth_api} from "../../http/api";
import {setBotRunning} from "../../redux/actions/userActions";

const Admin = () => {
    const {user} = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    const updateBot = (command) => {
        auth_api.post(`/${command}Bot`)
            .then(res => dispatch(setBotRunning(res.data.isBotRunning)))
            .catch(err => console.log(err))
    }

    return (
        <div>
            Is bot started: {user.isBotRunning.toString()}
            <button className='redOnHover' onClick={() => updateBot('stop')} disabled={!user.isBotRunning}>Stop bot</button>
            <button className='greenOnHover' onClick={() => updateBot('start')} disabled={user.isBotRunning}>Run bot</button>
        </div>
    );
};

export default Admin