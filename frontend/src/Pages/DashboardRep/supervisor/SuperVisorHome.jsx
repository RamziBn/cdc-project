import React, { useEffect, useState } from 'react'
import useUser from '../../../hooks/useUser'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import AdminStat from './adminStat'
const SuperVisorHome = () => {
    const {currentUser} = useUser()
    const axiosFetch = useAxiosFetch();
    const [users, setUsers] = useState([]);

    useEffect(()=>{
        axiosFetch.get('/users')
        .then(res => {setUsers(res.data)
        console.log(res.data)})
        .catch(err => console.log(err))
    },[])

  return (
    <div className=''>
    <div>
        <AdminStat className='gap-14 mt-8' users={users}/>
        <div>
            <h1 className='text-center gap-14 mt-28 text-4xl capitalize font-bold'>Hi, <span className='text-secondary items-stretch'>{currentUser?.name}</span> Wlecome To <span className='text-secondary items-stretch'>{currentUser?.role}</span> Dashboard</h1>
            <p className='text-center text-base py-2'>Hey Dear, This is a simple dashbpard home . Our Developer is trying to updating Dashboard.</p>
            
        </div>
    </div>
</div>
  )
}

export default SuperVisorHome