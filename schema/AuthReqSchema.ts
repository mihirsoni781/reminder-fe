import * as yup from "yup";

export const authReqSchema = yup.object({
    name: yup.string().when('action', {
        is: 'signup',
        then: schema => schema.required('Name is required'),
        otherwise: schema => schema.notRequired(),
    }),
    action: yup.string().oneOf(['login', 'signup']).required(),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string().when('action', {
        is: 'signup',
        then: schema =>
            schema
                .required('Confirm Password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
        otherwise: schema => schema.notRequired(),
    }),
});
export type AuthReqSchema = yup.InferType<typeof authReqSchema>;
