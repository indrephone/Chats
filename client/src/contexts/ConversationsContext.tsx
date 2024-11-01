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
    console.log("Reducer action:", action); // Log each action dispatched
    switch(action.type){
        case 'setConversations':
            console.log("Setting conversations:", action.data); // Log data for setting conversations
            return action.data;
        case 'addConversation':
            console.log("Adding new conversation:", action.newConversation); // Log new conversation being added
            return [ ...state, action.newConversation]; 
        case 'deleteConversation':
            console.log("Deleting conversation with ID:", action.id); // Log ID of conversation being deleted
            return state.filter(conversation => conversation._id !== action.id); 
        case 'reset':
            console.log("Resetting conversations"); // Log reset action
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

 console.log("Logged-in user ID:", userId); // Log the user ID

            if (userId) {
                try {
                    const response = await fetch(`/api/conversations`, {
                        headers: { '_id': userId }
                    });
                    const data = await response.json();

console.log("Fetched conversations:", data); // Log fetched conversations

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