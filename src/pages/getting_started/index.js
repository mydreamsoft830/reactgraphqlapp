import { CallToActionVerticalBox } from 'components/call_to_action'
// import { RiOrganizationChart } from 'react-icons/ri'
import { MdOutlineDevicesOther } from 'react-icons/md'
import { SiDatabricks } from 'react-icons/si'

const GettingStarted = () => {
  return (
    <>
      <h1>Getting Started</h1>

      <div>
        {/*
        <CallToActionVerticalBox
          icon={<RiOrganizationChart />}
          linkText={'Create Organisation'}
          linkUrl={'/organisation/create'}
        >
          <h4>Setup your Organisation</h4>
          <p>
            Setup your organisation to easily manage users and permission across
            your entire workplace.
          </p>
        </CallToActionVerticalBox>
  */}
        <CallToActionVerticalBox
          icon={<MdOutlineDevicesOther />}
          linkText={'Add a Device'}
          linkUrl={'/devices/create'}
        >
          <h4>Add a new Device</h4>
          <p>
            Provision a new a device to start collecting data immediately and
            unlock new potential in your IoT network
          </p>
        </CallToActionVerticalBox>

        <CallToActionVerticalBox
          icon={<SiDatabricks />}
          linkText={'Explore'}
          linkUrl={'/data/explore'}
        >
          <h4>Explore your Data</h4>
          <p>Start exploring your collected data and find new insights</p>
        </CallToActionVerticalBox>
      </div>
    </>
  )
}

export default GettingStarted
