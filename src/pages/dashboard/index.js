import { Routes, Route } from 'react-router-dom'
import DashboardList from './list'
import DashboardView from './view'

const Dashboard = () => {
  return (
    <Routes>
      <Route path="list" element={<DashboardList />} />
      <Route path="/:dashboardId" element={<DashboardView />} />
    </Routes>
  )
}

export default Dashboard
