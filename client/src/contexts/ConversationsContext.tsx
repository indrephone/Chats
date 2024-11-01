import { useReducer, useEffect, createContext, ReactElement, useState } from 'react';
import { UserType, ErrorOrSuccessReturn} from "../contexts/UsersContext";

type ChildProp = { children: ReactElement };
export type ConversationType = {
    _id: string,
    user1: string,
    user2: string,
    hasUnreadMessages: boolean
};
type ConversationWithUser = ConversationType & {
  userData: UserType[]
}
export type ConversationsContextTypes ={
    conversations: ConversationWithUser[];
    dispatch: React.Dispatch<ReducerActionTypeVariations>;
};
type ReducerActionTypeVariations = 
| { type: 'setConversations', data: ConversationWithUser[]} 
| { type: 'addConversation', newConversation: ConversationWithUser} 
| { type: 'deleteConversation', id: string }
| { type: 'reset'}

const reducer = ( state: ConversationWithUser[], action: ReducerActionTypeVariations): ConversationWithUser[] =>{
    switch(action.type){
        case 'setConversations':
            return action.data;
        case 'addConversation':
            return [ ...state, action.newConversation]; 
        case 'deleteConversation':
            return state.filter(conversation => conversation._id !== action.id); 
        case 'reset':
            return [];
        default:
            return state;           
    }
}
 

const ConversationsContext = createContext<ConversationsContextTypes | undefined>(undefined);

const ConversationsProvider = ({children}: ChildProp) => {
    const [ conversations, dispatch ] = useReducer(reducer,  []);

    useEffect(() => {
        const fetchConversations = async () => {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
            const userId = loggedInUser?._id;

            if (userId) {
                try {
                    const response = await fetch(`/api/conversations`, {
                        headers: { '_id': userId }
                    });
                    const data = await response.json();
                    dispatch({ type: 'setConversations', data });
                } catch (error) {
                    console.error("Failed to fetch conversations:", error);
                }
            }
        };

        fetchConversations();
    }, []);

    return (
        <ConversationsContext.Provider 
            value={{
              conversations,
              dispatch     
            }}
            >
            {children}
        </ConversationsContext.Provider>
    )
}

export {ConversationsProvider};
export default ConversationsContext;