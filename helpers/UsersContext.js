import { useContext, createContext, useState, useEffect } from "react";
import { getUsers } from "../functions/functions";
const UsersContext = createContext()

export function UsersProvider({children}) {
    const[users, setUsers] = useState([])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const usersData = await getUsers()
    //         if(usersData.success) {
    //             setUsers(usersData.success)
    //         }
    //     }
    //     fetchData()
    // })
    return (
        <UsersContext.Provider value={{ users, setUsers }}>
            {children}
        </UsersContext.Provider>
    )
}

export function useUsers() {
    return useContext(UsersContext)
}