import { Routes, Route } from 'react-router-dom'

import RuleList from './list'
import RuleView from './view'

const Rules = () => {
  return (
    <>
      <Routes>
        <Route index element={<RuleList />} />
        <Route path="list" element={<RuleList />} />
        <Route path="create" element={<RuleList />} />
        <Route path=":ruleId/*" element={<RuleView />} />
      </Routes>
    </>
  )
}

export default Rules
