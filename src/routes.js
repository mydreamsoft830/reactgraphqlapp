import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

import Logout from 'pages/auth'
import { LoadingFullFrame } from 'components/loading'

const Activity = lazy(() => import('pages/activity'))
const Profile = lazy(() => import('pages/profile'))
const ProjectSettings = lazy(() => import('pages/project_settings'))
const Devices = lazy(() => import('pages/devices'))
const Rules = lazy(() => import('pages/rules'))
const Data = lazy(() => import('pages/data'))
const Dashboard = lazy(() => import('pages/dashboard'))
const GettingStarted = lazy(() => import('pages/getting_started'))

const AppRoutes = () => (
  <Suspense fallback={<LoadingFullFrame />}>
    <Routes>
      <Route path="/activity/*" element={<Activity />} />
      <Route path="/profile/*" element={<Profile />} />
      <Route path="/project/:projectId/*" element={<ProjectSettings />} />
      <Route path="/devices/*" element={<Devices />} />
      <Route path="/rules/*" element={<Rules />} />
      <Route path="/data/*" element={<Data />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/logout" element={<Logout />} />
      <Route index element={<GettingStarted />} />
    </Routes>
  </Suspense>
)

export default AppRoutes
