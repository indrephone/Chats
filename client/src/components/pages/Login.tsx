import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { useContext, useState } from "react";
import styled from 'styled-components';

import UsersContext, { UsersContextTypes} from "../../contexts/UsersContext";

const LoginContainer = styled.section`
    display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  h2 {
    margin-bottom: 20px;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    gap: 10px;
  }

  p {
    margin-top: 15px;
    text-align: center;
  }
`;
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  gap: 10px; 

  > div{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 10px;
  }
`;
const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  box-sizing: border-box;
`;
const SubmitButton = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #7b68ee;
  color: white;
  outline: none;
  border: none;
  transition: background-color 0.3s ease, color 0.3s ease, font-size 0.3s ease, font-weight 0.3s ease;
 
  &:hover {
    color: #ff00ea;
    background-color: #6a5acd;
    font-size: 17px;
    font-weight: bold;
  }

  &:active {
    background-color: #4c3ccf;
    font-size: 17px;
    font-weight: bold; 
  }
`;

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
        <LoginContainer>
            <h2>Login</h2>
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
        </LoginContainer>
     );
}
 
export default Login;