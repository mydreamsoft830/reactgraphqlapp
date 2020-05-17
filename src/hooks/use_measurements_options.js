import { GetTimeseriesMeasurements } from 'graphql/queries'
import { useQuery } from '@apollo/client'
import { useStateContext } from 'context/state'

const useMeasurementsOptions = () => {
  const { selectedProject } = useStateContext()

  const { data: measurementsdata, error, loading } = useQuery(
    GetTimeseriesMeasurements,
    {
      variables: {
        projectId: selectedProject.id
      },
      fetchPolicy: 'network-only'
    }
  )

  const measurementOptions =
    measurementsdata && measurementsdata.timeseriesMeasurements
      ? measurementsdata.timeseriesMeasurements.map(({ name }) => ({
          value: name,
          label: name
        }))
      : []

  return { measurementOptions, error, loading }
}

export default useMeasurementsOptions
