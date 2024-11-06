import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { useContext, useState } from "react";

import UsersContext, { UsersContextTypes} from "../../contexts/UsersContext";
import {FormContainer, FormWrapper, StyledInput, SubmitButton} from '../styles/FormStyles';
import { StyledHeader } from '../styles/AllPageStyles';


const Login = () => {

    const { logUserIn } = useContext(UsersContext) as UsersContextTypes;
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
          username: '',
          password: ''
        },
        validationSchema: Yup.object({
          username: Yup.string()
           .min(5, 'Username must be at least 5 symbols long') 
           .max(20, 'Username must be up to 20 symbols long')
           .required('Field must be filled')
           .trim(),
          password: Yup.string()
           .matches(
             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
             'Slaptažodis privalo turėti bent: vieną mažąją raidę, vieną didžiąją raidę, vieną skaičių, vieną specialų simbolį (@$!%*?&) ir ilgis privalo būti tarp 8 ir 25 simbolių.'
           ).required('Field must be filled')  
         }),
         onSubmit: async (values) => {
            try {
                // console.log(values);
                const loginResponse = await logUserIn(values);
                if("error" in loginResponse){ 
                  setLoginMessage(loginResponse.error || '');
                } else {
                  setLoginMessage(loginResponse.success || '');
                  setTimeout(() => {
                    navigate('/profile');
                  }, 3000);
                }
              } catch(err) {
                console.error(err);
              }
            }  
      });
    return ( 
        <FormContainer>
            <StyledHeader>Login</StyledHeader>
            <FormWrapper onSubmit={formik.handleSubmit}>
                <div>
                    <StyledInput
                        type="text"
                        name="username" id="username"
                        placeholder="Username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {
                        formik.touched.username && formik.errors.username 
                        && <p>{formik.errors.username}</p>
                    }
                </div>
                <div>
                    <StyledInput
                        type="password"
                        name="password" id="password"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {
                        formik.touched.password && formik.errors.password 
                        && <p>{formik.errors.password}</p>
                    }
                </div>
                <SubmitButton type="submit" value="Sign In" />
            </FormWrapper>
            { loginMessage && <p>{loginMessage}</p> }
            <p>Do not have account? Go to <Link to="/register">Register</Link></p>
        </FormContainer>
     );
}
 
export default Login;