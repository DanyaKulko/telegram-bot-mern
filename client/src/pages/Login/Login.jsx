import React from 'react';
import {Formik} from 'formik';
import {useDispatch, useSelector} from "react-redux";
import {userLogin} from "../../redux/actions/userActions";
import {Navigate} from "react-router-dom";

const Login = () => {
    const user = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    if(user.isLoggedIn) {
        return <Navigate to='/admin' />
    }

    const validate = values => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
            errors.email = 'Invalid email address';
        }
        return errors;
    };

    const submitHandler = (values, {setSubmitting}) => {
        dispatch(userLogin(values)).then(() => {
            setSubmitting(false);
        });
    };

    return (
        <div>
            Login
            <Formik
                initialValues={{email: '', password: ''}}
                validate={validate}
                onSubmit={submitHandler}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                  }) => (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                        {errors.email && touched.email && (<div>{errors.email}</div>)}
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                        {errors.password && touched.password && (<div>{errors.password}</div>)}
                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </form>
                )}

            </Formik>

        </div>
    );
};

export default Login