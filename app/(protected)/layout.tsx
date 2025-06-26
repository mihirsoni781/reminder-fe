'use client';
import Header from "@/components/header/header";
import { useSnackbar } from "@/context/snackbar";

import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { showMessage } = useSnackbar();
    const tokenExist = Cookies.get('accessToken') !== undefined;
    useEffect(() => {
        if (!tokenExist) {
            showMessage("Please login to continue", "error");
            const currentPath = window.location.pathname;
            router.push(`/login?navigateTo=${currentPath}`);
        }
    }, [router, showMessage, tokenExist]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            {children}
        </div>
    );
}