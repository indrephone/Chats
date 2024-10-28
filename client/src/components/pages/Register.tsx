import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Link, useNavigate } from 'react-router-dom';
import {useContext, useState} from 'react';

import UsersContext, {UsersContextTypes, UserRegistrationType} from '../../contexts/UsersContext';


const Register = () => {
  const {addNewUser} = useContext(UsersContext) as UsersContextTypes;
  const [registerMessage, setRegisterMessage] = useState('');

  const formik = useFormik({
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
        onSubmit: (values) =>
    return ( 
        <section>
            
        </section>
     );
}
 
export default Register;