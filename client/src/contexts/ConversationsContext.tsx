import { useReducer, useEffect, createContext, ReactElement, useState } from 'react';
import { UserType} from "../contexts/UsersContext";

type ChildProp = { children: ReactElement };
export type ConversationType = {
    _id: string,
    user1: string,
    user2: string,
    hasUnreadMessages: boolean
};
type ConversationWithUser = ConversationType & {
  userData: UserType;
}
export type ConversationsContextTypes ={
    conversations: ConversationWithUser[];
    activeConversationId: string | null;
    setActiveConversation: (id: string) => void;
    dispatch: React.Dispatch<ReducerActionTypeVariations>; 
    getConversationCount: () => number;
    startOrGetConversation: (otherUserId: string) => Promise<string | null> 
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
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

    const setActiveConversation = (id: string) => {
        setActiveConversationId(id);
    };


    const startOrGetConversation = async (otherUserId: string): Promise<string | null> => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        const userId = loggedInUser?._id;
    
        if (!userId) {
            console.error("User ID is missing");
            return null;
        }
    
        // Check if conversation already exists
        const existingConversation = conversations.find(
            conversation => 
                (conversation.user1 === userId && conversation.user2 === otherUserId) ||
                (conversation.user1 === otherUserId && conversation.user2 === userId)
        );
    
        if (existingConversation) {
            setActiveConversationId(existingConversation._id);
            return existingConversation._id; // Return the ID of the existing conversation
        }
    
        // If no existing conversation, create a new one
        try {
            const response = await fetch(`/api/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    '_id': userId
                },
                body: JSON.stringify({ user1: userId, user2: otherUserId }),
            });
            const newConversation = await response.json();
            if (newConversation.error) {
                console.error("Error creating conversation:", newConversation.error);
                return null;
            }
            dispatch({ type: 'addConversation', newConversation });
            setActiveConversationId(newConversation._id);
            return newConversation._id;
        } catch (error) {
            console.error("Failed to start or get conversation:", error);
            return null;
        }
    };
    

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

                 // Check if data is filtered properly to include both user1 and user2 matches
                const filteredConversations = data.filter((conversation: ConversationType )=> 
                conversation.user1 === userId || conversation.user2 === userId
              );

                    dispatch({ type: 'setConversations', data: filteredConversations });
                } catch (error) {
                    console.error("Failed to fetch conversations:", error);
                }
            }
        };

        fetchConversations();
        console.log("Conversations state:", conversations); // Log conversations state after fetch
    }, []);


// Function to get conversation count for the logged-in user
const getConversationCount = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const userId = loggedInUser?._id;

    return conversations.filter(conversation => 
        conversation.user1 === userId || conversation.user2 === userId
    ).length;
};



    return (
        <ConversationsContext.Provider 
            value={{
              conversations,
              activeConversationId,
              setActiveConversation,
              dispatch,
              getConversationCount,
              startOrGetConversation    
            }}
            >
            {children}
        </ConversationsContext.Provider>
    )
}

export {ConversationsProvider};
export default ConversationsContext;