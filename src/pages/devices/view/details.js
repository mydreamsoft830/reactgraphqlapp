import './details.scss'

import Date from 'components/date'

const Detail = ({ label, value }) => (
  <div>
    <span>{label}</span>
    <span>{value}</span>
  </div>
)

const DeviceDetails = ({ device }) => {
  return (
    <div className="details-frame">
      <Detail label="ID" value={device.id} />
      <Detail label="Display Name" value={device.displayName} />
      <Detail label="Device Type" value={device.type} />
      <Detail label="Created" value={<Date time={device.createdAt} />} />
      <Detail label="Last Updated" value={<Date time={device.updatedAt} />} />
    </div>
  )
}

export default DeviceDetails
