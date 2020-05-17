import CodeEditor from '@uiw/react-textarea-code-editor'
import { useContext, useState, useMemo, useCallback } from 'react'
import { Form, FormContext, SubmitButton } from 'components/form'
import { useMutation } from '@apollo/client'
import { UpdateRule } from 'graphql/mutations'
import { useStateContext } from 'context/state'
import { ActionsEdit } from './actions_edit'
import useLocalStorage from 'hooks/use_local_storage'
import Rule from 'rules/rule'
import { Buffer } from 'buffer/'
import mixpanel from 'mixpanel-browser'

import './edit.scss'

const RuleExpressionEditor = ({ error }) => {
  const { formState, updateFormValue } = useContext(FormContext)

  return (
    <div className="rule">
      <span className="edit-label">Rule</span>

      <CodeEditor
        value={formState.ruleSql}
        language="SQL"
        placeholder="Please enter an SQL Rule"
        onChange={({ target: { value } }) => {
          updateFormValue('ruleSql', value)
        }}
        padding={15}
        className={error ? 'error' : ''}
        style={{
          height: '100%',
          fontSize: 12,
          fontFamily:
            'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
        }}
      />
    </div>
  )
}

const RuleEditForm = ({ rule }) => {
  const { formState } = useContext(FormContext)
  const isSparkplug = formState.ruleSql.includes('Sparkplug(')
  const [ruleError, setRuleError] = useState(false)
  const [topic, setTopic] = useLocalStorage(
    `rule.${rule.id}.testTopic`,
    `example/topic`
  )
  const [payload, setPayload] = useLocalStorage(
    `rule.${rule.id}.testPayload`,
    isSparkplug
      ? 'CI/3r8GKMBIOCghNeU1ldHJpYyADUAo='
      : `{\n  "timestamp": 1652088896399, \n  "metric" : "Sample Metric",\n  "value": 123.45\n}`
  )
  const [payloadEncoding, setPayloadEncoding] = useState(
    isSparkplug ? 'base64' : 'plaintext'
  )
  const [payloadError, setPayloadError] = useState(false)

  const ruleOutput = useMemo(() => {
    try {
      const encoding = payloadEncoding === 'plaintext' ? 'utf8' : 'base64'
      const parsedRule = new Rule(formState.ruleSql)
      const payloadBuffer = Buffer.from(payload, encoding)
      const output = parsedRule.execute(payloadBuffer, topic)
      const jsonOutput = JSON.stringify(output, null, 2)

      setRuleError(false)
      setPayloadError(false)

      return jsonOutput
    } catch (e) {
      console.dir(e)
      //TODO: Display error message
      if (e instanceof SyntaxError) {
        setPayloadError(true)
        return null
      }

      switch (e.message) {
        case 'Invalid Sparkplug payload':
          setPayloadError(true)
          break
        default:
          setRuleError(true)
      }
      return null
    }
  }, [formState, payload, topic, payloadEncoding])

  return (
    <>
      <div className="rule-edit">
        <RuleExpressionEditor error={ruleError} />

        <div className="test-results">
          <div className="test-input">
            <span className="edit-label">Test Topic</span>
            <CodeEditor
              value={topic}
              language="JSON"
              placeholder="Please enter a test message to parse"
              onChange={(evn) => setTopic(evn.target.value)}
              padding={15}
              style={{
                fontSize: 12,
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
              }}
            />

            <span className="edit-label">
              <span>Test Message</span>
              <span>
                <select
                  value={payloadEncoding}
                  onChange={(e) => setPayloadEncoding(e.target.value)}
                >
                  <option value="plaintext">Plaintext</option>
                  <option value="base64">Base64</option>
                </select>
              </span>
            </span>
            <CodeEditor
              value={payload}
              language="JSON"
              placeholder="Please enter a test message to parse"
              className={payloadError ? 'error' : ''}
              onChange={(evn) => setPayload(evn.target.value)}
              padding={15}
              style={{
                flex: '1 1',
                fontSize: 12,
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
              }}
            />
          </div>

          <div className="test-output">
            <span className="edit-label">Rule Test Output</span>

            <CodeEditor
              value={ruleOutput}
              language="JSON"
              placeholder="Please enter a test message to parse"
              onChange={() => {}}
              padding={15}
              style={{
                height: '100%',
                fontSize: 12,
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
              }}
              readOnly={true}
            />
          </div>
        </div>
      </div>

      <div>
        <SubmitButton label={'Save Rule'} />
      </div>
    </>
  )
}

const RuleEdit = ({ rule }) => {
  const [doUpdateRule, { loading, error }] = useMutation(UpdateRule)
  const { selectedProject } = useStateContext()

  const submitRuleUpdate = useCallback(
    async (params) => {
      await doUpdateRule({
        variables: {
          projectId: selectedProject.id,
          ruleId: rule.id,
          displayName: rule.displayName,
          ruleSQLString: params.ruleSql
        }
      })

      mixpanel.track('Edited rule', {
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        ruleId: rule.id,
        displayName: rule.displayName,
        ruleSQLString: params.ruleSql
      })
    },
    [rule, selectedProject, doUpdateRule]
  )

  return (
    <Form
      initialState={{
        ruleSql: rule.ruleSQLString
      }}
      onSubmit={submitRuleUpdate}
      errors={error}
      loading={loading}
    >
      <RuleEditForm rule={rule} />
      <ActionsEdit rule={rule} />
    </Form>
  )
}

export default RuleEdit
