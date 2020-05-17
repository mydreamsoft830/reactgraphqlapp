import Header from './header'
import Sidebar from './sidebar'
import Content from './content'
import MenuItem from './menu_item'
import SubMenuItem from './sub_menu_item'
import DashboardItem from './dashboard_item'

import './template.scss'
import 'style/theme_variables.scss'

import { FiActivity } from 'react-icons/fi'
import {
  BsFileBarGraphFill,
  BsFillLightningFill,
  BsFillLaptopFill
} from 'react-icons/bs'
import { RiDeviceFill } from 'react-icons/ri'
import { AiOutlineFileSearch } from 'react-icons/ai'

export const Template = ({ children }) => {
  return (
    <span>
      <Header />
      <div className='content-container'>
        <Sidebar>
          <MenuItem
            name='Getting Started'
            icon={<BsFillLightningFill />}
            url='/'
          />
          <MenuItem
            name='Dashboard'
            icon={<BsFillLaptopFill />}
            url='/dashboard'
            prefixes={['/dashboard']}
          >
            <SubMenuItem name='List' url='/dashboard/list' />
            <DashboardItem />
          </MenuItem>

          <MenuItem name='Activity' icon={<FiActivity />} url='/activity' />

          <MenuItem name='Rules' icon={<AiOutlineFileSearch />} url='/rules' />
          <MenuItem
            name='Data'
            icon={<BsFileBarGraphFill />}
            url='/data'
            prefixes={['/data']}
          >
            <SubMenuItem name='Explore' url='/data/explore' />
            <SubMenuItem name='Summary' url='/data/summary' />
          </MenuItem>
          <MenuItem
            name='Devices'
            icon={<RiDeviceFill />}
            url='/devices'
            prefixes={['/devices', '/device_types']}
          >
            <SubMenuItem name='Devices' url='devices' />
          </MenuItem>
        </Sidebar>
        <Content>{children}</Content>
      </div>
    </span>
  )
}

// <MenuItem name="Sim Cards" icon={<BsSimFill />} url="/sim_cards" />
