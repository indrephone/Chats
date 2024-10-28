import { createContext, useReducer, useState, useEffect, ReactElement} from 'react';

type ChildProp = { children: ReactElement };
export type UserType ={
    _id: string,
    username: string,
    profileImage: string,
    password: string,
    passwordRepeat: string,
};
export type ErrorOrsuccessReturn = {error?: string, success?: string};
export type UsersContextTypes ={
    users: UserType[]
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
//    const [loggedInUser, setLoggedInUser] = useState<null | UserType>(null);




   useEffect(() => {
    fetch(`/http://localhost:5173/users`)
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
             users
            //  logUserIn
           }}
        ></UsersContext.Provider>
)
}

export {UsersProvider};
export default UsersContext;