'use client';

import { Alert, Snackbar } from '@mui/material';
import { createContext, useContext, useState, ReactNode } from 'react';

type SnackbarContextType = {
    showMessage: (message: string, type?: 'success' | 'error' | 'info') => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) throw new Error('useSnackbar must be used within SnackbarProvider');
    return context;
};

type Props = {
    children: ReactNode;
};

export const SnackbarProvider = ({ children }: Props) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error' | 'info'>('info');

    const showMessage = (msg: string, msgType: 'success' | 'error' | 'info' = 'info') => {
        setMessage(msg);
        setType(msgType);
        setOpen(true);
        setTimeout(() => setOpen(false), 3000); // auto-hide
    };

    return (
        <SnackbarContext.Provider value={{ showMessage }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpen(false)} severity={type} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
