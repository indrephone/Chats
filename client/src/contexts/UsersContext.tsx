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
    addNewUser: (user: Omit<UserType, "_id">) => Promise<ErrorOrSuccessReturn>
    loggedInUser: UserType | null,
    logUserIn: (userLoginInfo: Pick<UserType, "username" | "password">) => Promise<ErrorOrSuccessReturn>,
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
      // Log the user data before sending to the backend
    // console.log("Sending user data to backend:", user);

     const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

     // Log the raw response from the backend
    //  console.log("Response from backend:", res);

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

  const logUserIn = async (userLoginInfo: Pick<UserType, 'username' | 'password'>): Promise<ErrorOrSuccessReturn> => {
    try {
      // console.log(userLoginInfo);
      const res = await fetch(`/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(userLoginInfo)
      });
      // console.log(res);
      if(res.status === 401){ // neteisingos prisijungimo įvestys
        const error = await res.json();
        // console.log(error);
        return error;
      } else { // teisingos prisijungimo įvestys
        const data = await res.json();
        // console.log(data);
        setLoggedInUser(data);
        localStorage.setItem('loggedInUser', JSON.stringify(data));
        return { success: 'Prisijungimas sėkmingas. Tuoj būsite nukelti į Home puslapį.' }
      }
    } catch(err) {
      console.error(err);
      return { error: 'Bandant prisijungti, įvyko serverio klaida. Prašome bandyti vėliau.' };
    }
  }  



   useEffect(() => {
    fetch(`/api/users`)
      .then(res => res.json())
      .then(data => dispatch({
        type: "uploadData",
        allData: data
      }))
      .catch(err => console.error(err));
    const localStorageInfo = localStorage.getItem('savedUserInfo');
    if(localStorageInfo){
      const userInfo = JSON.parse(localStorageInfo) as UserType ;
      logUserIn({ username: userInfo.username, password: userInfo.password });
      setLoggedInUser(userInfo);
    }
  }, []);   

     return (
        <UsersContext.Provider
           value={{
             users,
             loggedInUser,
             addNewUser,
             logUserIn
           }}
       >
        {children}
       </UsersContext.Provider>
)
}

export {UsersProvider};
export default UsersContext;