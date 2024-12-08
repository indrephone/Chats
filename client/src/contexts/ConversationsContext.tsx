import { useReducer, useEffect, createContext, useState } from 'react';
import { UserType} from "../contexts/UsersContext";

type ChildProp = { children?: React.ReactNode  };
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
    addMessage: (conversationId: string, messageContent: string) => Promise<void>;
    fetchConversations: () => void;
    deleteConversation: (conversationId: string) => Promise<void>
};
type ReducerActionTypeVariations = 
| { type: 'setConversations', data: ConversationWithUser[]} 
| { type: 'addConversation', newConversation: ConversationWithUser} 
| { type: 'deleteConversation', id: string }
| { type: 'reset'}

const reducer = ( state: ConversationWithUser[], action: ReducerActionTypeVariations): ConversationWithUser[] =>{
    // console.log("Reducer action:", action); // Log each action dispatched
    switch(action.type){
        case 'setConversations':
            console.log("Reducer received data:", action.data); 
            return action.data;
        case 'addConversation':
            // console.log("Adding new conversation:", action.newConversation); // Log new conversation being added
            return [ ...state, action.newConversation]; 
        case 'deleteConversation':
            // console.log("Deleting conversation with ID:", action.id); // Log ID of conversation being deleted
            return state.filter(conversation => conversation._id !== action.id); 
        case 'reset':
            // console.log("Resetting conversations"); // Log reset action
            return [];
        default:
            return state;           
    }
}
 

const ConversationsContext = createContext<ConversationsContextTypes | undefined>(undefined);

const ConversationsProvider = ({ children }: ChildProp ) => {

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
            
            // Re-fetch conversations to ensure the state is updated with the new conversation
            await fetchConversations();
            setActiveConversationId(newConversation._id);
            return newConversation._id;
        } catch (error) {
            console.error("Failed to start or get conversation:", error);
            return null;
        }
    };
       

// Function to fetch conversations
const fetchConversations = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    // console.log("Logged-in user retrieved from local storage:", loggedInUser);

    const userId = loggedInUser?._id;
    // console.log("User ID:", userId);

    if (userId) {
        try {
            // console.log("Fetching conversations with user ID:", userId);
            const response = await fetch(`/api/conversations`, {
                headers: { '_id': userId }
            });
            console.log("Fetch response:", response);

            const data = await response.json();
            // console.log("Conversations data:", data);

            dispatch({ type: 'setConversations', data });
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        }
    }else {
        console.warn("No user ID found; skipping fetch.");
    }
};


     // Function to add a message and re-fetch conversations
     const addMessage = async (conversationId: string, messageContent: string) => {
        try {
            const response = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: messageContent })
            });
            if (response.ok) {
                fetchConversations(); // Re-fetch conversations to update `hasUnreadMessages`
            } else {
                console.error("Failed to post message");
            }
        } catch (error) {
            console.error("Failed to add message:", error);
        }
    };


    const deleteConversation = async (conversationId: string) => {
        try {
          const response = await fetch(`/api/conversations/${conversationId}`, {
            method: 'DELETE',
            headers: {
              '_id': JSON.parse(localStorage.getItem('loggedInUser') || '{}')._id
            }
          });
          if (response.ok) {
            dispatch({ type: 'deleteConversation', id: conversationId });
          } else {
            console.error("Failed to delete conversation");
          }
        } catch (error) {
          console.error("Error deleting conversation:", error);
        }
      };
      

// Function to get conversation count for the logged-in user
const getConversationCount = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const userId = loggedInUser?._id;

        // Log the retrieved user ID to ensure it is correct
        // console.log("Logged-in user ID:", userId);
        // console.log("Conversations in getConversationCount:", conversations); 

        return conversations.filter(conversation => 
            conversation.user1 === userId || conversation.user2 === userId
        ).length;
};

useEffect(() => {
    fetchConversations();
}, []);   

    return (
        <ConversationsContext.Provider 
            value={{
              conversations,
              activeConversationId,
              setActiveConversation,
              dispatch,
              getConversationCount,
              startOrGetConversation,
              addMessage,
              fetchConversations, // Expose fetchConversations for reuse 
              deleteConversation   
            }}
            >
            {children }
        </ConversationsContext.Provider>
    )
}

export {ConversationsProvider};
export default ConversationsContext;