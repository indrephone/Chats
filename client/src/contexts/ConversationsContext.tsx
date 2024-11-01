import { useReducer, useEffect, createContext, ReactElement, useState } from 'react';

type ChildProp = { children: ReactElement };
export type ConversationType = {
    _id: string,
    user1: string,
    user2: string,
    hasUnreadMessages: boolean
};
export type ConversationsContextTypes ={};
type ReducerActionTypeVariations = {};
 

const ConversationsContext = createContext<ConversationsContextTypes | undefined>(undefined);

const ConversationsProvider = ({children}: ChildProp) => {

    return (
        <ConversationsContext.Provider 
            value={{

            }}
            >
            {children}
        </ConversationsContext.Provider>
    )
}

export {ConversationsProvider};
export default ConversationsContext;