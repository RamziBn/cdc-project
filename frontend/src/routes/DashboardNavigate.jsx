import React from 'react'
import useUser from '../hooks/useUser'
import { Navigate } from 'react-router-dom';

const DashboardNavigate = () => {
  const {currentUser,isLoading} = useUser();
  const role = currentUser?.role;

  if(isLoading){
    return <div className=' flex justify-center items-center h-screen'> 
        <HashLoader color="FF1949" />
    </div>
}

  if(role === 'supervisor') return <Navigate to="/dashboard/supervisor-home" replace/>
  if(role === 'admin') return <Navigate to="/dashboard/admin-home" replace/>
  if(role === 'user') return <Navigate to="/dashboard/user-home" replace/>

}

export default DashboardNavigate