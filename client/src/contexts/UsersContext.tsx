import { createContext, useReducer, useState, useEffect } from 'react';

const UsersContext = createContext();


const UsersProvider = ({children}) => {
     return (
        <UsersContext.Provider
           value={{

           }}
        ></UsersContext.Provider>
)
}

export {UsersProvider};
export default UsersContext;