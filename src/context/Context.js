import React, { createContext, useState } from 'react';

export const UserContext = createContext({ user: '', auth: false, profile: false });

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ user: '', auth: false, profile: false });

    const login = addr => {
        console.log(user)
        setUser({
            user: addr,
            auth: true,
            profile: false
        })
    };

    const logout = () => {
        console.log(user)
        setUser({
            user: '',
            auth: false,
            profile: false
        })
    };

    async function toggleProfile(prof) {
        console.log(user)
        setUser({
            user: user.user,
            auth: user.auth,
            profile: prof
        })
    }

    return (
        <UserContext.Provider value={{user, login, logout, toggleProfile}}>
            {children}
        </UserContext.Provider>
    )
}
