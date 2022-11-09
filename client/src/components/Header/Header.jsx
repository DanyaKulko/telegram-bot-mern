import React from 'react';
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../../redux/actions/userActions";
import './Header.css'

const Header = () => {
    const user = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const clickHandler = (e) => {
        e.preventDefault()
        dispatch(userLogout());
    }
    const links = [
        {to: '/admin', label: 'Main admin', exact: true},
        {to: '/admin/folders', label: 'Folders', exact: false},
        {to: '/admin/chats', label: 'Chats', exact: false},
        {to: '/admin/blackList', label: 'Black List', exact: false},
    ]

    return (
        <div className="header">

            <div className='headerLinks'>
                {user.isLoggedIn ?
                    (
                        <>
                            {links.map((link, index) => (
                                <NavLink
                                    key={index}
                                    to={link.to}
                                    className={({isActive}) => (isActive ? 'activeLink ' : '') + 'headerLink'}
                                    end
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                            <NavLink to='/logout' onClick={clickHandler}>Logout</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to='/'>Main page</NavLink>
                            <NavLink to='/login'>Login</NavLink>
                        </>
                    )}
            </div>
        </div>
    );
};

export default Header