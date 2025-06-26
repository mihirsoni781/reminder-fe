export type AuthResponse = {
    accessToken: string;
    accessTokenExpires: number;
    user: {
        id: string;
        email: string;
    };
}