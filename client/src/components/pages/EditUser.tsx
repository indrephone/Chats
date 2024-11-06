import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import UsersContext, { UserType, UsersContextTypes } from '../../contexts/UsersContext'; 
import {FormContainer, FormWrapper, StyledInput, SubmitButton, StyledLabel} from '../styles/FormStyles';


const EditUser: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const usersContext = useContext(UsersContext) as UsersContextTypes;
    const { returnSpecificUser, editSpecificUser } = usersContext;
  
  const [user, setUser] = useState<UserType | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const fetchedUser = returnSpecificUser(id);
      console.log("Fetched User:", fetchedUser);
      setUser(fetchedUser);
    }
  }, [id, returnSpecificUser]);

  const validationSchema = Yup.object({
    username: Yup.string()
    .min(5, 'username must be at least 5 symbols length')
    .max(20, 'Username can be up to 20 symbols length')
    .trim() ,
    profileImage: Yup.string()
    .url('Must be valid URL'),
    password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
      'Password must be at least: one lower case, one upper case, one number, one special symbol and length to be between 8 and 25'
    )
    .trim(),
    passwordRepeat: Yup.string().oneOf(
      [Yup.ref('password'), ''],
      'Passwords must match'
    ),
  });  

    return ( 
        user && (
          <FormContainer>
             <h2>Edit User</h2>
            <Formik
              initialValues={{
                username: user?.username || '',
                profileImage: user?.profileImage || '',
                password: '', // Password remains empty unless changed
                passwordRepeat: '', // Add passwordRepeat field for confirmation
              }}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={async (values) => {
                    // Create a filtered object that only includes non-empty values
                    const filteredValues = (Object.keys(values) as Array<keyof typeof values>).reduce((acc, key) => {
                      if (values[key] && values[key].trim() !== "") {
                          acc[key] = values[key];
                      }
                      return acc;
                  }, {} as Partial<typeof values>);  

                  console.log("Filtered Values:", filteredValues);

             
      
                const result = await editSpecificUser(filteredValues as Omit<UserType, '_id'>, user!._id);
                if ('success' in result) {
                  navigate('/profile');
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                 <FormWrapper as={Form}>
                  <div>
                    <StyledLabel htmlFor="username">Username:</StyledLabel>
                    <StyledInput as={Field} name="username" id="username" type="text" />
                    {errors.username && touched.username && <div>{errors.username}</div>}
                  </div>
                  <div>
                    <StyledLabel htmlFor="profileImage">Profile Image:</StyledLabel>
                    <StyledInput as={Field} name="profileImage" id="profileImage" type="text" placeholder="Enter profile image URL" />
                  </div>
                  <div>
                    <StyledLabel htmlFor="password">New Password:</StyledLabel>
                    <StyledInput as={Field} name="password" id="password" type="password" placeholder="Leave blank to keep current password"  />
                  </div>
                  <div>
                    <StyledLabel htmlFor="passwordRepeat">Password Repeat</StyledLabel>
                    <StyledInput as={Field} name="passwordRepeat" id="passwordRepeat" type="password" />
                    {errors.passwordRepeat && touched.passwordRepeat && <div>{errors.passwordRepeat}</div>}
                  </div>

                  <SubmitButton type="submit" disabled={isSubmitting} value="Update User" /> 
                </FormWrapper>
              )}
            </Formik>
          </FormContainer>
          )
 );
}
 
export default EditUser;