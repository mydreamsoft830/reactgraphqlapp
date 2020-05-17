import { useQuery } from '@apollo/client'

import { GetProjectDashboards } from 'graphql/queries'

import { useStateContext } from 'context/state'

import SubMenuItem from '../sub_menu_item'

import './dashboard_item.scss'



const DashboardItem = () => {
    const { selectedProjectId } = useStateContext()

    const { data } = useQuery(
        GetProjectDashboards,
        {
          variables: {
            projectId: selectedProjectId
          },
          fetchPolicy: 'network-only'
        }
    )

    return (
        <>
            <hr/>
            {
                data && data.dashboards.length > 0 &&
                data.dashboards.map((dashboard, index) => <SubMenuItem key={index.toString()} name={dashboard.displayName} url={"/dashboard/" + dashboard.id} />)
            }
            {
                (!data || data.dashboards.length === 0) &&
                <div className={'no-dashboards'}>{'No dashboards'}</div>
            }
            <hr/>
        </>
    )
}

export default DashboardItem;
