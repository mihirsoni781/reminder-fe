'use client';
import React from "react";
import { useForm, useFormState, useWatch } from 'react-hook-form';
import TextField from '@mui/material/TextField'
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthReqSchema, authReqSchema } from "@/schema/AuthReqSchema";
import { useLoginMutation, useSignupMutation } from "@/store/api/authApi";
import { Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from 'js-cookie';
import { useSnackbar } from "@/context/snackbar";

export const Login: React.FC = () => {
    const { register, reset, control, handleSubmit } = useForm({
        resolver: yupResolver(authReqSchema),
        defaultValues: {
            action: "login",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });
    const { showMessage } = useSnackbar();
    const params = useSearchParams();
    const { errors } = useFormState({ control });
    const action = useWatch({ control, name: "action" });
    const switchMode = (mode: "login" | "signup") => {
        reset({
            action: mode,
        });
    }
    const [login, { isLoading: loginLoading }] = useLoginMutation();
    const [signup, { isLoading: signupLoading }] = useSignupMutation();
    const isLoading = action === 'login' ? loginLoading : signupLoading;
    const router = useRouter();

    const onSubmit = async (data: AuthReqSchema) => {
        const resp = await (action === 'login' ? login(data) : signup(data));
        if (action == 'login' && resp?.data) {
            Cookies.set('accessToken', resp.data.accessToken, { expires: new Date(resp.data.accessTokenExpires - 1000) });
            Cookies.set('user', JSON.stringify(resp.data.user), { expires: new Date(resp.data.accessTokenExpires - 1000) });
            const navigateTo = params.get('navigateTo') || '/reminders';
            router.push(navigateTo);
            showMessage("Login successful", "success");
        } else if (action == 'signup' && resp?.data) {
            showMessage("Account created successfully, please login to continue", "success");
            switchMode('login');
        }
    };
    return (
        <div>
            
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                    <div className="flex mb-6 border-b border-gray-200">
                        <button
                            className={`flex-1 pb-2 text-center font-semibold border-b-2 focus:outline-none ${action === 'login' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                            type="button"
                            onClick={() => switchMode("login")}
                        >
                            Login
                        </button>
                        <button
                            className={`flex-1 pb-2 text-center font-semibold border-b-2 focus:outline-none ${action === 'signup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                            type="button"
                            onClick={() => switchMode("signup")}
                        >
                            Sign Up
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            {action === 'signup' && (
                                <TextField
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    size="small"
                                    className="w-full"
                                    label="Name"
                                    variant="outlined"
                                    type="text"
                                    id="name"
                                    placeholder="Enter your name"
                                    {...register("name")}
                                />
                            )}
                        </div>
                        <div>
                            <TextField
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                size="small"
                                className="w-full"
                                autoFocus
                                label="Email"
                                variant="outlined"
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                {...register("email")}
                            />
                        </div>
                        <div>
                            <TextField
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                size="small"
                                className="w-full"
                                label="Password"
                                variant="outlined"
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                {...register("password")}
                            />
                        </div>
                        {
                            action === 'signup' &&
                            <div>
                                <TextField
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    size="small"
                                    className="w-full"
                                    label="Confirm Password"
                                    variant="outlined"
                                    type="password"
                                    id="confirm-password"
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword", { required: action === 'signup' })}
                                />
                            </div>
                        }
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {action === 'login' ? 'Login' : 'Sign Up'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
