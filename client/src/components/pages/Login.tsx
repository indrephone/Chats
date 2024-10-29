import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { useContext, useState } from "react";

import UsersContext, { UsersContextTypes} from "../../contexts/UsersContext";


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
           ).required('Šis laukas yra privalomas.')  
         }),
         onSubmit: async (values) => {
            try {
                // console.log(values);
                const loginResponse = await logUserIn(values);
                if("error" in loginResponse){ 
                  setLoginMessage(loginResponse.error);
                } else {
                  setLoginMessage(loginResponse.success);
                  setTimeout(() => {
                    navigate('/');
                  }, 3000);
                }
              } catch(err) {
                console.error(err);
              }
            }  
      });
    return ( 
        <section>
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username" id="username"
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
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        name="password" id="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {
                        formik.touched.password && formik.errors.password 
                        && <p>{formik.errors.password}</p>
                    }
                </div>
                <input type="submit" value="Login" />
            </form>
            { loginMessage && <p>{loginMessage}</p> }
            <p>Do not have account? Go to <Link to="/register">Register</Link></p>
        </section>
     );
}
 
export default Login;