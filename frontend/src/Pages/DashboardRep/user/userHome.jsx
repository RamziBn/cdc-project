import React from 'react'
import useUser from '../../../hooks/useUser'
import img from '../../../assets/dashboard/urban-welcome.svg'
const userHome = () => {
    const {currentUser} = useUser()

  return (
    <div className='h-screen flex justify-center items-center'>
        <div>
            <div>
            <div className='flex justify-center'>
                    <img onContextMenu={e => e.preventDefault()} src={img} alt="" className='h-[200px]' placeholder='blur' />
                </div>
                <h1 className='text-4xl capitalize font-bold'>Hi, <span className='text-secondary items-stretch'>{currentUser?.name}</span> Wlecome To <span className='text-secondary items-stretch'>{currentUser?.role}</span> Dashboard</h1>
                <p className='text-center text-base py-2'>Hey Dear, This is a simple dashbpard home . Our Developer is trying to updating Dashboard.</p>
            </div>
        </div>
    </div>
  )
}

export default userHome