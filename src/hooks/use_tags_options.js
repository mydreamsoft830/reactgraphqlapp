import { useMemo } from 'react'
import { GetTimeseriesTags } from 'graphql/queries'
import { useLazyQuery } from '@apollo/client'
import { useStateContext } from 'context/state'

const useTagsOptions = (measurement) => {
  const { selectedProject } = useStateContext()

  const [loadTags, { data: tagsData }] = useLazyQuery(GetTimeseriesTags, {
    variables: {
      projectId: selectedProject.id,
      measurement: measurement
    },
    fetchPolicy: 'network-only'
  })

  const tagPairsOptions =
    tagsData && tagsData.timeseriesTags
      ? tagsData.timeseriesTags.map(({ name, value }) => ({
          value: `${name}:${value}`,
          label: `${name}=${value}`
        }))
      : []

  const tagsOptions = useMemo(() => {
    if (!(tagsData && tagsData.timeseriesTags)) return []

    const tagSet = new Set()

    tagsData.timeseriesTags.forEach(({ name }) => tagSet.add(name))

    return Array.from(tagSet).map((name) => {
      return {
        value: name,
        label: name
      }
    })
  }, [tagsData])

  return { loadTags, tagPairsOptions, tagsOptions }
}

export default useTagsOptions
