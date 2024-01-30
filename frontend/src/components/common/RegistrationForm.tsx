import React from 'react';
import {useDispatch} from 'react-redux';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {registerUser} from '../../actions/registrationActions';
import {AppDispatch} from "../../store/store";

const RegistrationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
});

const RegistrationForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Formik
      initialValues={{email: '', password: '', confirmPassword: ''}}
      validationSchema={RegistrationSchema}
      onSubmit={(values) => {
        dispatch(registerUser(values));
      }}
    >
      {({errors, touched}) => (
        <Form>
          <Field name="email" type="email"/>
          {errors.email && touched.email ? <div>{errors.email}</div> : null}

          <Field name="password" type="password"/>
          {errors.password && touched.password ? <div>{errors.password}</div> : null}

          <Field name="confirmPassword" type="password"/>
          {errors.confirmPassword && touched.confirmPassword ? <div>{errors.confirmPassword}</div> : null}

          <button type="submit">Register</button>
        </Form>
      )}
    </Formik>
  );
};

export default RegistrationForm;
