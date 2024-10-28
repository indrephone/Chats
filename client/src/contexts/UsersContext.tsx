import { createContext, useReducer, useState, useEffect, ReactElement} from 'react';

type ChildProp = { children: ReactElement };
export type UserType ={
    _id: string,
    username: string,
    profileImage: string,
    password: string
};
export type UserRegistrationType = {
  username: string;
  profileImage: string;
  password: string;
  passwordRepeat: string; // Only used for validation during registration
};
export type ErrorOrSuccessReturn = {error?: string, success?: string};
export type UsersContextTypes ={
    users: UserType[],
    addNewUser: (user: Omit<UserType, "_id">) => Promise<ErrorOrSuccessReturn>;
};
type ReducerActionTypeVariations =
| { type: 'uploadData'; allData: UserType[] }
| { type: 'add'; data: UserType };   


const reducer = (state: UserType[], action: ReducerActionTypeVariations): UserType[] => {
    switch (action.type) {
        case "uploadData":
            return action.allData;
        case "add":
            return [...state, action.data];    
     default:
        return state;
    }     
};


const UsersContext = createContext<UsersContextTypes | undefined>(undefined);


const UsersProvider = ({children}: ChildProp) => {
 
   const [users, dispatch] = useReducer(reducer, []);
   const [loggedInUser, setLoggedInUser] = useState<null | UserType>(null);
   

   const addNewUser = async (user: UserRegistrationType): Promise<ErrorOrSuccessReturn> => {
    try {
     const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      // Handle if username or other conflicts occur
      if (res.status === 409) return await res.json();
      
      const data = await res.json();
      
      // Update the context state with the new user
      dispatch({ type: 'add', data });
      setLoggedInUser(data);

      localStorage.setItem('loggedInUser', JSON.stringify(data)); // issaugojam i local storage
      return { success: 'Registration successful' };
    } catch (err) {
      console.error(err);
      return { error: 'Server error. Please try again later.' };
    }
  };



   useEffect(() => {
    fetch(`/api/users`)
      .then(res => res.json())
      .then(data => dispatch({
        type: "uploadData",
        allData: data
      }))
      .catch(err => console.error(err));
    // const localStorageInfo = localStorage.getItem('savedUserInfo');
    // if(localStorageInfo){
    //   const userInfo = JSON.parse(localStorageInfo) as Pick<UserType, 'username' | 'password' | 'profileImage'>;
    //   logUserIn({ username: userInfo.username, password: userInfo.password , profileImage: userInfo.profileImage });
    // }
  }, []);   

     return (
        <UsersContext.Provider
           value={{
             users,
             addNewUser
            //  logUserIn
           }}
       >
        {children}
       </UsersContext.Provider>
)
}

export {UsersProvider};
export default UsersContext;