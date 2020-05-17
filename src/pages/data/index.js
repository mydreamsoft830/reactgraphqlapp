import { Routes, Route } from 'react-router-dom'
import ExploreData from './explore'
import SummaryData from './summary'
const Data = () => {
  return (
    <>
      <Routes>
        <Route path="explore" element={<ExploreData />} />
        <Route path="summary" element={<SummaryData />} />
      </Routes>
    </>
  )
}

export default Data
