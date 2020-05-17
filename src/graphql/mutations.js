import { gql } from '@apollo/client'

export const UpdateProject = gql`
  mutation UpdateProject(
    $projectId: UUID!
    $name: String
    $environment: String
  ) {
    updateProject(
      projectId: $projectId
      name: $name
      environment: $environment
    ) {
      id
      name
      environment
    }
  }
`

export const CreateProject = gql`
  mutation CreateProject($name: String!, $environment: String!) {
    createProject(name: $name, environment: $environment) {
      id
      name
      environment
    }
  }
`

export const CreateProjectInvite = gql`
  mutation CreateProjectInvite(
    $projectId: UUID!
    $email: String!
    $permissions: [String]!
  ) {
    createProjectInvite(
      projectId: $projectId
      email: $email
      permissions: $permissions
    ) {
      permissions
      email
    }
  }
`

export const DeleteProjectInvite = gql`
  mutation DeleteProjectInvite($projectId: UUID!, $email: String!) {
    deleteProjectInvite(projectId: $projectId, email: $email)
  }
`
export const DeleteProjectMember = gql`
  mutation DeleteProjectMember($projectId: UUID!, $memberId: UUID!) {
    deleteProjectMember(projectId: $projectId, memberId: $memberId)
  }
`
export const CreateDevice = gql`
  mutation CreateDevice(
    $projectId: UUID!
    $displayName: String!
    $type: String!
  ) {
    createDevice(
      projectId: $projectId
      displayName: $displayName
      type: $type
    ) {
      id
      displayName
      type
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
          password
          createdAt
        }
      }
    }
  }
`

export const DeleteDevice = gql`
  mutation DeleteDevice($projectId: UUID!, $deviceId: UUID!) {
    deleteDevice(projectId: $projectId, deviceId: $deviceId)
  }
`

export const DeleteDeviceCredential = gql`
  mutation DeleteDeviceCredential(
    $projectId: UUID!
    $deviceId: UUID!
    $credentialId: UUID!
  ) {
    deleteDeviceCredential(
      projectId: $projectId
      deviceId: $deviceId
      credentialId: $credentialId
    )
  }
`

export const GenerateDeviceKeypairCredential = gql`
  mutation GenerateDeviceKeypairCredential(
    $projectId: UUID!
    $deviceId: UUID!
    $displayName: String!
    $publicKey: String
    $generateKeypair: Boolean!
  ) {
    generateDeviceKeypairCredential(
      projectId: $projectId
      deviceId: $deviceId
      displayName: $displayName
      publicKey: $publicKey
      generateKeypair: $generateKeypair
    ) {
      privateKey
      keypair {
        id
        displayName
        publicKey
      }
    }
  }
`

export const GenerateDevicePlaintextCredential = gql`
  mutation GenerateDevicePlaintextCredential(
    $projectId: UUID!
    $deviceId: UUID!
    $displayName: String!
    $length: Int!
  ) {
    generateDevicePlaintextCredential(
      projectId: $projectId
      deviceId: $deviceId
      displayName: $displayName
      length: $length
    ) {
      id
      displayName
      username
      password
      createdAt
    }
  }
`

export const MqttPublish = gql`
  mutation MqttPublish($projectId: UUID!, $topic: String!, $payload: String!) {
    mqttPublish(projectId: $projectId, topic: $topic, payload: $payload)
  }
`

export const CreateRule = gql`
  mutation CreateRule(
    $projectId: UUID!
    $displayName: String!
    $ruleSQLString: String!
  ) {
    createRule(
      projectId: $projectId
      displayName: $displayName
      ruleSQLString: $ruleSQLString
    ) {
      id
      displayName
      ruleSQLString
    }
  }
`

export const UpdateRule = gql`
  mutation UpdateRule(
    $projectId: UUID!
    $ruleId: UUID!
    $displayName: String!
    $ruleSQLString: String!
  ) {
    updateRule(
      projectId: $projectId
      ruleId: $ruleId
      displayName: $displayName
      ruleSQLString: $ruleSQLString
    ) {
      id
      displayName
      ruleSQLString
    }
  }
`

export const DeleteRule = gql`
  mutation DeleteRule($projectId: UUID!, $ruleId: UUID!) {
    deleteRule(projectId: $projectId, ruleId: $ruleId)
  }
`

export const DeleteDashboard = gql`
  mutation DeleteDashboard($projectId: UUID!, $dashboardId: UUID!) {
    deleteDashboard(projectId: $projectId, dashboardId: $dashboardId)
  }
`

export const CreateTimeseriesRuleAction = gql`
  mutation CreateTimeseriesRuleAction(
    $projectId: UUID!
    $ruleId: UUID!
    $displayName: String!
    $ruleAction: TimeseriesRuleActionInput!
  ) {
    createTimeseriesRuleAction(
      projectId: $projectId
      ruleId: $ruleId
      displayName: $displayName
      ruleAction: $ruleAction
    ) {
      __typename
      ... on TimeseriesRuleAction {
        id
        type
        measurement
        taggedFields
      }
    }
  }
`

export const UpdateTimeseriesRuleAction = gql`
  mutation UpdateTimeseriesRuleAction(
    $projectId: UUID!
    $ruleId: UUID!
    $ruleActionId: UUID!
    $displayName: String!
    $ruleAction: TimeseriesRuleActionInput!
  ) {
    updateTimeseriesRuleAction(
      projectId: $projectId
      ruleId: $ruleId
      ruleActionId: $ruleActionId
      displayName: $displayName
      ruleAction: $ruleAction
    ) {
      __typename
      ... on TimeseriesRuleAction {
        id
        type
        measurement
        taggedFields
      }
    }
  }
`
export const DeleteRuleAction = gql`
  mutation DeleteRuleAction(
    $projectId: UUID!
    $ruleId: UUID!
    $ruleActionId: UUID!
  ) {
    deleteRuleAction(
      projectId: $projectId
      ruleId: $ruleId
      ruleActionId: $ruleActionId
    )
  }
`

export const CompleteUserProjectInvite = gql`
  mutation CompleteUserProjectInvite($projectId: UUID!, $accept: Boolean!) {
    completeUserProjectInvite(projectId: $projectId, accept: $accept)
  }
`
export const ModifyProjectMemberPermissions = gql`
  mutation ModifyProjectMemberPermissions(
    $projectId: UUID!
    $memberId: UUID!
    $permissions: [String]!
  ) {
    modifyProjectMemberPermissions(
      projectId: $projectId
      memberId: $memberId
      permissions: $permissions
    )
  }
`

export const AddProjectDashboard = gql`
  mutation AddProjectDashboard($projectId: UUID!, $displayName: String!) {
    createDashboard(projectId: $projectId, displayName: $displayName) {
      id
      displayName
    }
  }
`

export const CreateDashBoardWidget = gql`
  mutation createDashboardWidget(
    $projectId: UUID!
    $dashboardId: UUID!
    $displayName: String!
    $type: DashboardWidgetType!
    $configuration: JSONObject!
    $position: DashboardWidgetPositionInput!
  ) {
    createDashboardWidget(
      projectId: $projectId
      dashboardId: $dashboardId
      displayName: $displayName
      type: $type
      configuration: $configuration
      position: $position
    ) {
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
`

export const DeleteDashboardWidget = gql`
  mutation deleteDashboardWidget(
    $projectId: UUID!
    $dashboardId: UUID!
    $dashboardWidgetId: UUID!
  ) {
    deleteDashboardWidget(
      projectId: $projectId
      dashboardId: $dashboardId
      dashboardWidgetId: $dashboardWidgetId
    )
  }
`

export const UpdateDashboardWidget = gql`
  mutation updateDashboardWidget(
    $projectId: UUID!
    $dashboardId: UUID!
    $dashboardWidgetId: UUID!
    $displayName: String!
    $type: DashboardWidgetType!
    $configuration: JSONObject!
    $position: DashboardWidgetPositionInput!
  ) {
    updateDashboardWidget(
      projectId: $projectId
      dashboardId: $dashboardId
      dashboardWidgetId: $dashboardWidgetId
      displayName: $displayName
      type: $type
      configuration: $configuration
      position: $position
    ) {
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
`

export const CreateDeviceShadow = gql`
  mutation createDeviceShadow(
    $projectId: UUID!
    $deviceId: UUID!
    $displayName: String!
  ) {
    createDeviceShadow(
      projectId: $projectId
      deviceId: $deviceId
      displayName: $displayName
    ) {
      displayName
      version
      desiredState
      reportedState
    }
  }
`
export const UpdateDeviceShadow = gql`
  mutation UpdateDeviceShadow(
    $projectId: UUID!
    $deviceId: UUID!
    $displayName: String!
    $desiredState: JSONObject
    $reportedState: JSONObject
  ) {
    updateDeviceShadow(
      projectId: $projectId
      deviceId: $deviceId
      displayName: $displayName
      desiredState: $desiredState
      reportedState: $reportedState
    ) {
      displayName
      desiredState
      reportedState
      version
    }
  }
`
export const DeleteDeviceShadow = gql`
  mutation DeleteDeviceShadow(
    $projectId: UUID!
    $deviceId: UUID!
    $displayName: String!
  ) {
    deleteDeviceShadow(
      projectId: $projectId
      deviceId: $deviceId
      displayName: $displayName
    )
  }
`
export const UpdateTimeseriesMeasurementMetadata = gql`
  mutation UpdateTimeseriesMeasurementMetadata(
    $projectId: UUID!
    $measurement: String!
    $metadata: TimeseriesMeasurementMetadataInput!
  ) {
    updateTimeseriesMeasurementMetadata(
      projectId: $projectId
      measurement: $measurement
      metadata: $metadata
    ) {
      description
    }
  }
`
export const UpdateTimeseriesFieldMetadata = gql`
  mutation updateTimeseriesFieldMetadata(
    $projectId: UUID!
    $measurement: String!
    $field: String!
    $metadata: TimeseriesFieldMetadataInput!
  ) {
    updateTimeseriesFieldMetadata(
      projectId: $projectId
      measurement: $measurement
      field: $field
      metadata: $metadata
    ) {
      description
      basePrefix
      unit
      perUnit
    }
  }
`
export const CreatePublishRuleAction = gql`
  mutation CreatePublishRuleAction(
    $projectId: UUID!
    $ruleId: UUID!
    $displayName: String!
    $ruleAction: PublishRuleActionInput!
  ) {
    createPublishRuleAction(
      projectId: $projectId
      ruleId: $ruleId
      displayName: $displayName
      ruleAction: $ruleAction
    ) {
      __typename
      ... on PublishRuleAction {
        id
        displayName
        type
        topic
      }
    }
  }
`
export const UpdatePublishRuleAction = gql`
  mutation UpdatePublishRuleAction(
    $projectId: UUID!
    $ruleId: UUID!
    $ruleActionId: UUID!
    $displayName: String!
    $ruleAction: PublishRuleActionInput!
  ) {
    updatePublishRuleAction(
      projectId: $projectId
      ruleId: $ruleId
      ruleActionId: $ruleActionId
      displayName: $displayName
      ruleAction: $ruleAction
    ) {
      __typename
      ... on PublishRuleAction {
        id
        displayName
        type
        topic
      }
    }
  }
`
