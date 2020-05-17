import { Routes, Route } from 'react-router-dom'

import General from './general'
import Invitations from './invitations'

import { Tabs, Tab } from 'components/tabs'

const UserProfile = () => {
  return (
    <>
      <h1>User Profile</h1>

      <Tabs>
        <Tab name="General" path="general" index />
        <Tab name="Invitations" path="invitations" />
      </Tabs>

      <Routes>
        <Route index element={<General />} />
        <Route path="general" element={<General />} />
        <Route path="invitations" element={<Invitations />} />
      </Routes>
    </>
  )
}

export default UserProfile
