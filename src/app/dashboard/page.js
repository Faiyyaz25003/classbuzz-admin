import Dashboard from '@/Components/Dashboard/Dashboard'
import Navbar from '@/Components/Layout/Navbar/Navbar'
import Sidebar from '@/Components/Layout/Sidebar/Sidebar'
import React from 'react'

const page = () => {
  return (
      <div>
          <Sidebar />
          <Navbar/>
       <Dashboard/>
    </div>
  )
}

export default page
