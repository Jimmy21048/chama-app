import { useContext, createContext, useState } from "react";

const UsersContext = createContext()

export function UsersProvider({children}) {
    const[users, setUsers] = useState([])
    return (
        <UsersContext.Provider value={{ users, setUsers }}>
            {children}
        </UsersContext.Provider>
    )
}

export function useUsers() {
    return useContext(UsersContext)
}