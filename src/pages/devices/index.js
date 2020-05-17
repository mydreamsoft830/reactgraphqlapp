import { Routes, Route } from 'react-router-dom'

import DeviceList from './list'
import DeviceView from './view'

const Devices = () => {
  return (
    <>
      <Routes>
        <Route index element={<DeviceList />} />
        <Route path="list" element={<DeviceList />} />
        <Route path="create" element={<DeviceList />} />
        <Route path=":deviceId/*" element={<DeviceView />} />
      </Routes>
    </>
  )
}

export default Devices
