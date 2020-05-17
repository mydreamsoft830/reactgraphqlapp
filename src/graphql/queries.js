import { gql } from '@apollo/client'

export const User = gql`
  query User {
    user {
      id
      name
      email
      lastLoginTime
      pictureUrl
      invites {
        permissions
        projectName
        projectId
        invitedByName
        expiresAt
      }
    }
  }
`

export const ProjectsForUser = gql`
  query ProjectsForUser {
    projects {
      id
      name
      environment
    }
  }
`

export const GetProject = gql`
  query GetProject($projectId: UUID!) {
    project(projectId: $projectId) {
      id
      name
      environment
      members {
        projectPermission {
          permissions
        }
        user {
          id
          name
          email
          lastLoginTime
          pictureUrl
        }
      }
      pendingMembers {
        email
        permissions
        expiresAt
      }
    }
  }
`

export const GetDevices = gql`
  query GetDevices($projectId: UUID!) {
    devices(projectId: $projectId) {
      id
      displayName
      type
    }
  }
`
export const GetDevice = gql`
  query GetDevice($projectId: UUID!, $deviceId: UUID!) {
    device(projectId: $projectId, deviceId: $deviceId) {
      id
      displayName
      type
      createdAt
      updatedAt

      credentials {
        __typename
        ... on DeviceKeypairCredential {
          id
          type
          displayName
          publicKey
          hasPrivateKey
          createdAt
        }
        ... on DevicePlaintextCredential {
          id
          displayName
          username
          createdAt
        }
      }

      shadows {
        displayName
        version
        desiredState
        reportedState
      }
    }
  }
`

export const GetDeviceAuthenticationToken = gql`
  query GetDeviceAuthenticationToken($projectId: UUID!, $deviceId: UUID!, $keypairId: UUID!) {
    deviceAuthenticationToken(projectId: $projectId, deviceId: $deviceId, keypairId: $keypairId)
  }
`

export const GetTimeseriesMeasurements = gql`
  query GetTimeseriesMeasurements($projectId: UUID!) {
    timeseriesMeasurements(projectId: $projectId) {
      name
      metadata {
        description
      }
    }
  }
`

export const GetTimeseriesFields = gql`
  query GetTimeseriesFields($projectId: UUID!, $measurement: String!) {
    timeseriesFields(projectId: $projectId, measurement: $measurement) {
      name
      metadata {
        description
        unit
        perUnit
        basePrefix
      }
    }
  }
`

export const GetTimeseriesTags = gql`
  query GetTimeseriesTags($projectId: UUID!, $measurement: String!) {
    timeseriesTags(projectId: $projectId, measurement: $measurement) {
      name
      value
    }
  }
`

export const GetTimeseriesQueryData = gql`
  query GetTimeseriesQueryData(
    $projectId: UUID!
    $query: String!
    $startTime: DateTime!
    $endTime: DateTime!
    $rollupInterval: Int!
  ) {
    timeseriesQuery(
      projectId: $projectId
      query: $query
      startTime: $startTime
      endTime: $endTime
      rollupInterval: $rollupInterval
    ) {
      groupTags
      timestamps
      fields {
        name
        values
      }
    }
  }
`

export const GetTimeseriesMultiQueryData = gql`
  query GetTimeseriesMultiQueryData(
    $projectId: UUID!
    $queries: [String!]
    $startTime: DateTime!
    $endTime: DateTime!
    $rollupInterval: Int
  ) {
    timeseriesMultiQuery(
      projectId: $projectId
      queries: $queries
      startTime: $startTime
      endTime: $endTime
      rollupInterval: $rollupInterval
    ) {
      query
      results {
        groupTags
        timestamps
        fields {
          name
          metadata {
            basePrefix
            unit
            perUnit
          }
          values
        }
      }
    }
  }
`
export const TimeseriesMultiQuery = gql`
  query TimeseriesMultiQuery (
    $projectId: UUID!,
    $queries: [String!], 
    $startTime: DateTime!, 
    $endTime: DateTime!
  ) {
  timeseriesMultiQuery(
    projectId: $projectId, 
    queries: $queries, 
    startTime: $startTime, 
    endTime: $endTime
  ) {
    query
    results {
      groupTags
      timestamps
      fields {
        name
        metadata {
          basePrefix
          unit
          perUnit
        }
        values
      }
    }
  }
}
`
export const GetRules = gql`
  query GetRules($projectId: UUID!) {
    rules(projectId: $projectId) {
      id
      displayName
      ruleSQLString
      createdAt
      updatedAt
      actions {
        __typename
        ... on TimeseriesRuleAction {
          id
          displayName
          type
          measurement
          taggedFields
        }
        ... on PublishRuleAction {
          id
          displayName
          type
          topic
        }
      }
    }
  }
`

export const GetRule = gql`
  query GetRule($projectId: UUID!, $ruleId: UUID!) {
    rule(projectId: $projectId, ruleId: $ruleId) {
      id
      displayName
      ruleSQLString
      createdAt
      updatedAt
      actions {
        __typename
        ... on TimeseriesRuleAction {
          id
          displayName
          type
          measurement
          taggedFields
        }
        ... on PublishRuleAction {
          id
          displayName
          type
          topic
        }
      }
    }
  }
`

export const GetProjectDashboards = gql`
  query GetProjectDashboards($projectId: UUID!) {
    dashboards(projectId: $projectId) {
      id
      displayName
      widgets {
        id
        displayName
        type
        configuration
        position {
          x
          y
          w
          h
        }
      }
    }
  }
`

export const GetDashboardInfo = gql`
  query dashboard($projectId: UUID!, $dashboardId: UUID!) {
    dashboard(projectId: $projectId, dashboardId: $dashboardId) {
      id
      displayName
      widgets {
        id
        displayName
        type
        configuration
        position {
          x
          y
          w
          h
        }
      }
    }
  }
`
export const TimeseriesMeasurementsQuery = gql`
  query TimeseriesMeasurementsQuery ($projectId: UUID!) {
    timeseriesMeasurements(projectId: $projectId) {
      name
      metadata {
        description
      }
    }
  }
`
