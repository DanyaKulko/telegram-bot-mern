import './App.css';
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import {useEffect, useState} from "react";
import {checkAuth} from "./redux/actions/userActions";
import {useDispatch} from "react-redux";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Folders from "./pages/Admin/Folders/Folders";
import Chats from "./pages/Admin/Chats/Chats";
import BlackList from "./pages/Admin/BlackList/BlackList";
import Admin from "./pages/Admin/Admin";

function App() {
    // if token exists, make a request to the backend to verify the token
    const [loading, setLoading] = useState(!!localStorage.getItem("token"));
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(checkAuth()).then(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="App">
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/admin" element={<ProtectedRoute/>}>
                    <Route path="" element={<Admin/>}/>
                    <Route path="folders" element={<Folders/>}/>
                    <Route path="chats" element={<Chats/>}/>
                    <Route path="blackList" element={<BlackList/>}/>
                </Route>

            </Routes>
        </div>
    );
}

export default App;
