import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Link, useNavigate } from 'react-router-dom';
import {useContext, useState} from 'react';

import UsersContext, {UsersContextTypes, UserRegistrationType} from '../../contexts/UsersContext';
import {FormContainer, FormWrapper, StyledInput, SubmitButton} from '../styles/FormStyles';


const Register = () => {
  const {addNewUser} = useContext(UsersContext) as UsersContextTypes;
  const [registerMessage, setRegisterMessage] = useState('');
  const navigate = useNavigate();

  const formik = useFormik<UserRegistrationType>({
    initialValues: {
        username: '',
        profileImage: '',
        password: '',
        passwordRepeat: '',
    },
    validationSchema: Yup.object({
        username: Yup.string()
         .min(5, 'username must be at least 5 symbols length')
         .max(20, 'Username can be up to 20 symbols length')
         .required('Field is required')
         .trim(),
        profileImage: Yup.string()
          .url('Must be valid URL'),
          password: Yup.string()
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
            'Password must be at least: one lower case, one upper case, one number, one special symbol and length to be between 8 and 25'
          )
          .required('Field must be filled')
          .trim(),
        passwordRepeat: Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Field must be filled')
    }),
        onSubmit: async (values: UserRegistrationType) => {

            console.log("Form values being submitted:", values);

          const { username, profileImage, password } = values;
            
          const registerResponse = await addNewUser({
            username,
            profileImage,
            password,
        });
           if(registerResponse.error){
             setRegisterMessage(registerResponse.error || '');
           } else {
             setRegisterMessage(registerResponse.success || 'Registration successful');
             setTimeout(() => {
                navigate('/profile');
             }, 3000);
           }
        }

  });

    return ( 
        <FormContainer>
            <h2>Register</h2>
            <FormWrapper onSubmit={formik.handleSubmit} >
            <div>
                <StyledInput
                type="text"
                name="username" id="username"
                placeholder="Username"
                value={formik.values.username}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                />
                {
                formik.touched.username && formik.errors.username &&
                <p>{formik.errors.username}</p>
                }
            </div>  
            <div>
                <StyledInput
                type="url"
                name="profileImage" id="profileImage"
                placeholder="Profile Image URL"
                value={formik.values.profileImage}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                />
                {
                formik.touched.profileImage && formik.errors.profileImage &&
                <p>{formik.errors.profileImage}</p>
                }
            </div>
            <div>
                <StyledInput
                type="password"
                name="password" id="password"
                placeholder="Password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                />
                {
                formik.touched.password && formik.errors.password &&
                <p>{formik.errors.password}</p>
                }
            </div> 
            <div>
                <StyledInput
                type="password"
                name="passwordRepeat" id="passwordRepeat"
                placeholder="Password Repeat"
                value={formik.values.passwordRepeat}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                />
                {
                formik.touched.passwordRepeat && formik.errors.passwordRepeat &&
                <p>{formik.errors.passwordRepeat}</p>
                }
                </div> 
                <SubmitButton  type="submit" value="Sign Up"/>  
            </FormWrapper>
            {registerMessage && <p>{registerMessage}</p>}
            <p>Allready have an account? Go to: <Link to="/login">Sign In</Link></p>
        </FormContainer>
     );
}
 
export default Register;