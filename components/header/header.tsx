'use client';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { AppBar, Box, Button, IconButton, Menu, Toolbar, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const router = useRouter();
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('user');
        router.push('/login')
        handleClose();
    };

    const user = JSON.parse(Cookies.get('user') ?? '{}') as ({ email: string, name: string });
    return (
        <AppBar position="static" className='bg-blue-600!'>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Reminder App
                </Typography>
                <Box>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        onClick={handleMenu}
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <div className='p-4'>
                            <h4 className='mb-4'>Hello ! {user.name}</h4>
                            <Button sx={{
                                textTransform: 'none',
                            }} onClick={handleLogout} variant='contained' color='error'>Logout</Button>
                        </div>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}