import { NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Switch } from "@mui/material";
import { FaHome, FaUser, FaBars } from 'react-icons/fa';
import { motion } from "framer-motion";
import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import Swal from 'sweetalert2';

const navLinks = [
    { name: 'Home', route: '/' },
    //{ name: 'Departement', route: '/departement' },
    //{ name: 'Competences', route: '/competences' },
    //{ name: 'User', route: '/user' },
];

const theme = createTheme({
    palette: {
        primary: { main: "#ff0000" },
        secondary: { main: "#00ff00" }
    }
});

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isHome, setIsHome] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isFixed, setFixed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [navBg, setNavBg] = useState('bg-[#15151580]');

    const { logout } = useAuth();
    const { currentUser } = useUser();
    const role = currentUser?.role;
    const isUserLoggedIn = !!currentUser; // Vérifie si l'utilisateur est connecté

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const darkClass = 'dark';
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add(darkClass);
        } else {
            root.classList.remove(darkClass);
        }
    }, [isDarkMode]);

    useEffect(() => {
        setIsHome(location.pathname === '/');
        setIsLogin(location.pathname === '/login');
        setFixed(location.pathname === '/register' || location.pathname === '/login');
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.pageYOffset;
            setScrollPosition(currentPosition);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (scrollPosition > 100) {
            if (isHome) {
                setNavBg('bg-white backdrop-blur-xl bg-opacity-0 dark:text-white text-black');
            } else {
                setNavBg('bg-white dark:bg-black dark:text-white text-black');
            }
        } else {
            setNavBg(`${isHome || location.pathname === '/' ? 'bg-transparent' : 'bg-white dark:bg-black'} dark:text-white text-white`);
        }
    }, [scrollPosition]);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Log out Me!"
        }).then((result) => {
            if (result.isConfirmed) {
                logout().then(Swal.fire({
                    title: "Log Out!",
                    text: "Your has been log out.",
                    icon: "success"
                })
                ).catch((error) => console.log(error));
                navigate('/');
            }

        });
    };

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`${isHome ? navBg : "bg-white dark:bg-black backdrop-blur-2xl"} ${isFixed ? 'static' : 'fixed'} top-0 transition-colors duration-500 ease-in-out w-full z-10`}
        >
            <div className="lg:w-[95%] mx-auto sm:px-6 lg:px-6">
                <div className="px-4 py-4 flex items-center justify-between">
                    {/* LOGO */}
                    <div onClick={() => navigate('/')} className="flex-shrink-0 cursor-pointer pl-7 md:p-0 flex items-center">
                        <img src="../../../public/logo-cdc_0.png" alt="" className="" />
                    </div>

                    {/* Mobile menu Icons */}
                    <div className="md:hidden flex items-center">
                        <button type="button" onClick={toggleMobileMenu} className="text-gray-300 hover:text-white focus:outline-none">
                            <FaBars className="h-6 w-6 hover:text-primary" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:block text-black dark:text-white">
                        <div className="flex">
                            <ul className="ml-10 flex items-center space-x-4 pr-4">
                                {navLinks.map((link) => (
                                    <li key={link.route}>
                                        <NavLink
                                            to={link.route}
                                            style={{ whiteSpace: "nowrap" }}
                                            className={({ isActive }) =>
                                                `font-bold ${isActive ? 'text-red-500' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-red-500 duration-300`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}

                                {/* Bouton Dashboard */}
                                {isUserLoggedIn && (role === 'admin' || role === 'supervisor') && (
                                    <li>
                                        <NavLink
                                            to='/dashboard'
                                            className={({ isActive }) =>
                                                `font-bold ${isActive ? 'text-red-500' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`}
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                )}

                                {/* USER IMAGE */}
                                {isUserLoggedIn && currentUser?.photourl && (
                                    <li>
                                        <img src={currentUser.photourl} alt="User" className="h-[40px] rounded-full w-[40px]" />
                                    </li>
                                )}

                                {/* Bouton LOGIN / LOGOUT */}
                                {isUserLoggedIn ? (
                                    <li>
                                        <NavLink
                                            onClick={handleLogout}
                                            className='font-bold px-3 py-2 bg-red-500 text-white rounded-xl'
                                        >
                                            Logout
                                        </NavLink>
                                    </li>
                                ) : (
                                    <li>
                                        <NavLink
                                            to="/login"
                                            className={({ isActive }) =>
                                                `font-bold ${isActive ? 'text-red-500' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-red-500 duration-300`}
                                        >
                                            Login
                                        </NavLink>
                                    </li>
                                )}

                                {/* COLOR TOGGLE */}
                                <li>
                                    <ThemeProvider theme={theme}>
                                        <div className="flex flex-col justify-center items-center">
                                            <Switch onChange={() => setIsDarkMode(!isDarkMode)} />
                                            <h1 className="text-[8px]">Light/Dark</h1>
                                        </div>
                                    </ThemeProvider>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default NavBar;
