import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import UsersContext, { UserType, UsersContextTypes } from '../../contexts/UsersContext'; 


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
    username: Yup.string().required('Username is required'),
    password: Yup.string(),
    passwordRepeat: Yup.string().oneOf(
      [Yup.ref('password'), ''],
      'Passwords must match'
    ),
  });  

    return ( 
        user && (
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
                // Filter out the password if it hasn't been changed
                let filteredValues: Partial<Omit<UserType, '_id'>> = {
                  username: values.username || user?.username,
                  profileImage: values.profileImage || user?.profileImage,
                };

                if (values.password) {
                    filteredValues = { ...filteredValues, password: values.password };
                  }
                
      
                const result = await editSpecificUser(filteredValues as Omit<UserType, '_id'>, user!._id);
                if ('success' in result) {
                  navigate('/profile');
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div>
                    <label htmlFor="username">Username:</label>
                    <Field name="username" id="username" type="text" />
                    {errors.username && touched.username && <div>{errors.username}</div>}
                  </div>
                  <div>
                    <label htmlFor="profileImage">Profile Image:</label>
                    <Field name="profileImage" id="profileImage" type="text" placeholder="Enter profile image URL" />
                  </div>
                  <div>
                    <label htmlFor="password">New Password:</label>
                    <Field name="password" id="password" type="password" placeholder="Leave blank to keep current password"  />
                  </div>
                  <div>
                    <label htmlFor="passwordRepeat">Password Repeat</label>
                    <Field name="passwordRepeat" id="passwordRepeat" type="password" />
                    {errors.passwordRepeat && touched.passwordRepeat && <div>{errors.passwordRepeat}</div>}
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    Update User
                  </button>
                </Form>
              )}
            </Formik>
          )
 );
}
 
export default EditUser;