import React, {useEffect, useState} from 'react';
import {
    addToBlackListRequest,
    getAllFromBlackListRequest,
    removeFromBlackListRequest
} from "../../../http/chatRequests";

const BlackList = () => {
    const [blackList, setBlackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filteredBlackList, setFilteredBlackList] = useState([]);

    useEffect(() => {
        getAllFromBlackListRequest()
            .then((res) => {
                setBlackList(res.data.blackList);
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        setFilteredBlackList(
            blackList.filter((item) => item.chatNumber.includes(search))
        );
    }, [search, blackList]);

    const handleCreate = (e) => {
        e.preventDefault()
        if(!newNumber) {
            return
        }
        addToBlackListRequest(newNumber)
            .then((res) => {
                setBlackList([...blackList, res.data.newBlackListItem]);
                setNewNumber('')
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    };

    const handleDelete = (id) => {
        removeFromBlackListRequest(id)
            .then((res) => {
                setBlackList(blackList.filter((item) => item._id !== id));
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    };

    return (
        <div>
            BlackList
            <form onSubmit={handleCreate}>
                <input type="text" placeholder='Add new number' value={newNumber}
                       onChange={(e) => setNewNumber(e.target.value)}/>
                <button type='submit'  className='greenOnHover'>Add</button>
            </form>




            {loading && <div>Loading...</div>}
            {error && <div>Error</div>}
            {!loading && !error && (
                <div>
                    <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <ul>
                        {filteredBlackList.length > 0 ? filteredBlackList.map((item) => (
                            <li key={item._id}>{item.chatNumber} - <button className='redOnHover' onClick={() => handleDelete(item._id)}>Delete</button></li>

                        )) : <li>No items</li>}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BlackList