import React, { useState } from 'react'
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import { BiHomeAlt, BiLogInCircle, BiSelectMultiple,BiBookReader  } from "react-icons/bi"
import { FaUsers, FaHome,FaCalculator } from 'react-icons/fa'
import { BsFillPostcardFill } from 'react-icons/bs'
import { TbBrandAppleArcade } from 'react-icons/tb'
import { BiBarChartSquare,BiChart,BiDoughnutChart  } from "react-icons/bi";
import { MenuItem } from '@mui/material';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import Scroll from '../hooks/useScroll'

const userNavItems = [
    { to: "/dashboard/admin-home", icon: <BiHomeAlt className='text-2xl' />, label: "DashBoard Home" },
    { to: "/dashboard/manager-user", icon: <FaUsers className='text-2xl' />, label: "Manage Users" },
    { to: "/dashboard/manage-departement", icon: <BsFillPostcardFill className='text-2xl' />, label: "Manage Departement" },
    { to: "/dashboard/manage-competence", icon: <TbBrandAppleArcade className='text-2xl' />, label: "Competence" },
    { to: "/dashboard/manage-post", icon: <FaHome className='text-2xl' />, label: "Posts" },
    { to: "/dashboard/manage-usercom", icon: <FaHome className='text-2xl' />, label: "User Competence" },
    { to: "/dashboard/manage-kpi", icon: <TbBrandAppleArcade className='text-2xl' />, label: "KPI" },
];

const adminNavItems = [
    
    { to: "/dashboard/admin-home", icon: <BiHomeAlt className='text-2xl' />, label: "DashBoard Home" },
    { to: "/dashboard/manage-departement", icon: <BsFillPostcardFill className='text-2xl' />, label: "Departement" },
    { to: "/dashboard/manage-post", icon: <FaHome className='text-2xl' />, label: "Posts" },
    { to: "/dashboard/manager-user", icon: <FaUsers className='text-2xl' />, label: "Slaries" },
    { to: "/dashboard/manage-competence", icon: <TbBrandAppleArcade className='text-2xl' />, label: "Competence" },
    { to: "/dashboard/manage-usercom", icon: <FaHome className='text-2xl' />, label: "User Competence" },
    { to: "/dashboard/usercompetencedetail", icon: <BiBookReader  className='text-2xl' />, label: "User Competence Detail" },
    { to: "/dashboard/manage-kpi", icon: <TbBrandAppleArcade className='text-2xl' />, label: "KPI" },
    { to: "/dashboard/manage-userkpi", icon: <BiDoughnutChart   className='text-2xl' />, label: "User KPI %" },
    { to: "/dashboard/manage-formule", icon: <FaCalculator  className='text-2xl' />, label: "Formule Indiv" },
    { to: "/dashboard/manage-formule-gen", icon: <FaCalculator  className='text-2xl' />, label: "Formule Generale" },
    { to: "/dashboard/manage-indicateur", icon: <BiChart  className='text-2xl' />, label: "Indicateur Glob/Struc" },
    { to: "/dashboard/manage-note", icon: <BiBarChartSquare  className='text-2xl' />, label: "Moyen Par Departement" },
    { to: "/dashboard/manage-notef", icon: <BiBarChartSquare  className='text-2xl' />, label: "Moyen Final" },




];

const superVisorNavItems = [
    { to: "/dashboard/supervisor-home", icon: <BiHomeAlt className='text-2xl' />, label: "Home" },
    { to: "/dashboard/manager-usersu", icon: <FaUsers className='text-2xl' />, label: "Manage Users" },
    { to: "/dashboard/manage-departementsu", icon: <BsFillPostcardFill className='text-2xl' />, label: "Manage Departement" },
    { to: "/dashboard/manage-competencesu", icon: <TbBrandAppleArcade className='text-2xl' />, label: "Competence" },
    { to: "/dashboard/manage-postsu", icon: <FaHome className='text-2xl' />, label: "Posts" },
    { to: "/dashboard/manage-usercomsu", icon: <FaHome className='text-2xl' />, label: "User Competence" },
    { to: "/dashboard/manage-kpi", icon: <TbBrandAppleArcade className='text-2xl' />, label: "KPI" },
];

const lastMenuItem = [
    { to: "/", icon: <BiHomeAlt className='text-2xl' />, label: "Home" },
];

const DashboardLayout = () => {
    const [open, setOpen] = useState(true);
    const { loader, logout } = useAuth();
    const { currentUser } = useUser();
    const navigate = useNavigate();
    const role = currentUser?.role;

    const handleLogOut = () => {
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

    }

    if (loader) {
        return <div>Loading ... </div>
    }

    return (
        <div className='flex'>
            <div className={`${open ? "w2 overflow-y-auto" : "w-[90px] overflow-auto"} bg-white-700 h-screen p-5 md:block hidden pt_8 relative duration-300`}>
                <div className='flex gap-x-4 items -center'>
                    <img onClick={() => setOpen(!open)} src="../../public/cdc-Icon.png" alt="logo cdc" className={`cursor-pointer h-[25px] duration-500 ${open && "rotate-[360deg]"}`} />
                    <h1 onClick={() => setOpen(!open)} className={`text-dark-primary cursor-pointer font-bold origin-left text-x1 duration-200 ${!open && "scale-0"}`}>DashBoard</h1>
                </div>


                {/*NavLink */}
                {/*ADMIN*/}
                {
                    role === "admin" && (<ul className='pt-6'>
                        <p className={`ml-3 text-gray-700 ${!open && "hidden"}`}> <small>Admin - MENU</small></p>
                        {
                            role === "admin" && adminNavItems.map((MenuItem, index) => (
                                <li key={index} className='mb-3'>
                                    <NavLink to={MenuItem.to}
                                        className={({ isActive }) => `flex ${isActive ? "bg-red-500 text-white" : "text-[#413F44]"} 
                                duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4 `}>{MenuItem.icon}
                                        <span className={`${!open && "hidden"} origin-left duration-200`}>{MenuItem.label}</span>

                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                )}

                {/*SuperVisor*/}
                {
                    role === "supervisor" && (<ul className='pt-6'>
                        <p className={`ml-3 text-gray-700 ${!open && "hidden"}`}> <small>SuperVisor - MENU</small></p>
                        {
                            role === "supervisor" && superVisorNavItems.map((MenuItem, index) => (
                                <li key={index} className='mb-3'>
                                    <NavLink to={MenuItem.to}
                                        className={({ isActive }) => `flex ${isActive ? "bg-red-500 text-white" : "text-[#413F44]"} 
                                duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4 `}>{MenuItem.icon}
                                        <span className={`${!open && "hidden"} origin-left duration-200`}>{MenuItem.label}</span>

                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                )}

                {/*Useful Links*/}
                <ul className='pt-6'>
                    <p className={`ml-3 text-gray-700 ${!open && "hidden"}`}> <small>Useful Links</small></p>
                    {
                        role === "user" && lastMenuItem.map((MenuItem, index) => (
                            <li key={index} className='mb-3'>
                                <NavLink to={MenuItem.to}
                                    className={({ isActive }) => `flex ${isActive ? "bg-red-500 text-white" : "text-[#413F44]"} 
                                duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4 `}>{MenuItem.icon}
                                    <span className={`${!open && "hidden"} origin-left duration-200`}>{MenuItem.label}</span>

                                </NavLink>
                            </li>

                        ))
                    }
                    <li className='mb-3'>
                        <NavLink
                            onClick={() => handleLogOut()}
                            className={({ isActive }) => `flex ${isActive ? "bg-red-500 text-white" : "text-[#413F44]"} 
                                duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4 `}>
                            <BiLogInCircle className='text-2xl' />
                            <span className={`${!open && "hidden"} origin-left duration-200`}>
                                Logout
                            </span>

                        </NavLink>
                    </li>
                </ul>

            </div>
            
            <div className='mt-10 ml-20'>
                <Scroll />
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout