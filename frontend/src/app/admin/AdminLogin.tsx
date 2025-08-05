import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store'; // Adjust path to your Redux store
import { loginAdmin } from '../features/thunks/authThunks'; // Adjust path to your thunks

// Validation schema is unchanged
const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const AdminLogin = () => {
    const [apiError, setApiError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-[#7a1436]">Admin Login</h1>
                </div>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setApiError(null);
                        try {
                            await dispatch(loginAdmin(values)).unwrap();
                            navigate('/admin');

                        } catch (error: any) {
                            // If unwrap() throws, the thunk was rejected. 'error' is the payload from rejectWithValue.
                            console.error('Login failed:', error);
                            setApiError(error || 'Invalid email or password. Please try again.');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={`w-full px-3 py-2 border rounded-md ... ${errors.email && touched.email ? 'border-red-500 ring-red-500' : 'border-gray-300 ring-[#7a1436]'}`}
                                    placeholder="you@example.com"
                                />
                                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={`w-full px-3 py-2 border rounded-md ... ${errors.password && touched.password ? 'border-red-500 ring-red-500' : 'border-gray-300 ring-[#7a1436]'}`}
                                    placeholder="********"
                                />
                                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                            </div>

                            {apiError && <div className="text-center text-sm text-red-600">{apiError}</div>}

                            {/* Submit Button */}
                            <div>
                                <button type="submit" disabled={isSubmitting} className="w-full ...">
                                    {isSubmitting ? 'Logging in...' : 'Log In'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AdminLogin;