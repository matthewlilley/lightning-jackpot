import { Form, Input, Select, Table, Typography } from 'antd'
import { createSystem, distribute } from 'provably-fair-framework'

import { Component, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { RouletteStrategy } from '@lightning-jackpot/common'
import { createHmac } from 'crypto'

// function Verifier({ serverSeed, clientSeed, instanceId, winningNumber }) {
//   return ()
// }

export function Verifier() {
  // props = {
  //   serverSeed:
  //     'f6746d819e6ce622ecd14f3512a535616a823eb6570c10808f81521b35106bdb',
  //   clientSeed: '35309723',
  //   instanceId: '0',
  //   winningNumber: null,
  // }
  const [state, setState] = useState({
    serverSeed:
      'f6746d819e6ce622ecd14f3512a535616a823eb6570c10808f81521b35106bdb',
    clientSeed: '35309723',
    instanceId: '0',
    winningNumber: null,
  })

  const system = createSystem({
    algorithm: 'sha256',
    strategy: new RouletteStrategy(),
  })

  // componentDidMount() {
  //   this.setState({
  //     winningNumber: this.system.calculate([
  //       this.state.serverSeed,
  //       `${this.state.clientSeed}:${this.state.instanceId}`,
  //     ]),
  //   })
  // }

  function handleSubmit() {
    //
  }

  function handleChange(event) {
    const value = event.target.value
    const name = event.target.name
    this.setState({ ...state, [name]: value.trim() })
    if (state.serverSeed && state.clientSeed && state.instanceId) {
      const winningNumber = system.calculate([
        state.serverSeed,
        `${state.clientSeed}:${state.instanceId}`,
      ])
      setState({ ...state, winningNumber })
    } else {
      setState({
        ...state,
        winningNumber: null,
      })
    }
  }

  const hash = createHmac(system.algorithm, state.serverSeed)
    .update(`${state.clientSeed}:${state.instanceId}`)
    .digest('hex')

  const distributions = distribute(hash)

  function handleSelectChange(value) {
    console.log(`selected ${value}`)
  }
  const [form] = Form.useForm()

  return (
    <Form onFinish={handleSubmit} form={form}>
      <Form.Item>
        <Select
          size="large"
          defaultValue="roulette"
          style={{ width: '100%' }}
          onChange={handleSelectChange}
        >
          <Select.Option value="roulette">Roulette</Select.Option>
          <Select.Option value="test">Test</Select.Option>
          <Select.Option value="disabled" disabled={true}>
            Jackpot
          </Select.Option>
        </Select>

        {/* {getFieldDecorator('game', {
          rules: [{ required: true, message: 'Please select a game!' }],
        })(
          <Select
            defaultValue='roulette'
            size='large'
            style={{ width: '100%' }}
            onChange={handleSelectChange}
          >
            <Select.Option value='roulette'>Roulette</Select.Option>
            <Select.Option value='disabled' disabled>
              Jackpot
            </Select.Option>
          </Select>,
        )} */}
      </Form.Item>

      <Form.Item
        name="serverSeed"
        rules={[
          {
            required: true,
            type: 'string',
            message: 'The input is not valid Server Seed!',
          },
          {
            // should be 64 characters.
            min: 64,
            max: 64,
            message: 'The input is not valid Server Seed!',
          },
          {
            required: true,
            message: 'Please input the Server Seed!',
          },
        ]}
      >
        <Input onChange={handleChange} size="large" placeholder="Server Seed" />
      </Form.Item>
      <Form.Item
        name="clientSeed"
        rules={[
          {
            // should be between 5 and 10 characters.
            type: 'string',
            min: 5,
            max: 10,
            message: 'The input is not valid Client Seed!',
          },
          {
            required: true,
            message: 'Please input the Client Seed!',
          },
        ]}
      >
        <Input onChange={handleChange} size="large" placeholder="Client Seed" />
      </Form.Item>
      <Form.Item
        name="instanceId"
        rules={[
          {
            required: true,
            message: 'Please input the Instance #!',
          },
        ]}
      >
        <Input onChange={handleChange} size="large" placeholder="Instance #" />
      </Form.Item>

      {/* <Typography.Title level={3}>Seeds to Bytes</Typography.Title> */}
      {/* <Typography.Paragraph code={true}> */}
      {/* HMAC_SHA256({this.state.serverSeed}, {this.state.clientSeed}:
        {this.state.instanceId}) */}
      {/* const hash = createHmac(algorithm,
        serverSeed).update(clientSeed).digest('hex'); */}
      {/* </Typography.Paragraph> */}
      {/* <Typography.Paragraph code={true}>
        const distributions = distribute( hash );
      </Typography.Paragraph> */}
      <Table
        bordered={true}
        size="small"
        scroll={{ x: true }}
        columns={distributions.map(distribution => ({
          title: distribution.byte,
          key: distribution.index,
          dataIndex: 'integer',
          render: (text: any, record: any, index: number) => {
            return distribution.index < 4 ? (
              <Highlighter
                highlightStyle={{
                  backgroundColor: 'rgb(114, 46, 209)',
                  color: 'white',
                  padding: 0,
                }}
                searchWords={[String(distribution.integer)]}
                autoEscape={true}
                textToHighlight={String(distribution.integer)}
              />
            ) : (
              <Typography.Text type="secondary">
                {distribution.integer}
              </Typography.Text>
            )
          },
        }))}
        dataSource={[distributions]}
      />

      {/* <Typography.Title level={3}>Bytes to Number</Typography.Title> */}

      <Typography.Paragraph
        style={{
          fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
        }}
      >
        (
        {distributions
          .slice(0, 4)
          .map(distribution => distribution.integer)
          .join(', ')}
        ) -> [{RouletteStrategy.min}, ..., {RouletteStrategy.max}] ={' '}
        {state.winningNumber}
      </Typography.Paragraph>

      {distributions.slice(0, 4).map((distribution, index) => (
        <Typography.Paragraph
          key={index}
          style={{
            fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
          }}
        >
          {index > 0 ? <span>+&nbsp;</span> : <span>&nbsp;&nbsp;</span>}
          {distribution.float.toFixed(12)}{' '}
          <Typography.Text type="secondary">
            ({distribution.integer} / ({(hash.length / 2) * 8} ^ {index + 1}
            ))
          </Typography.Text>
        </Typography.Paragraph>
      ))}

      <Typography.Paragraph
        style={{
          fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
        }}
      >
        ={' '}
        {distributions
          .slice(0, 4)
          .reduce((previousValue, { float }) => previousValue + float, 0)
          .toFixed(12)}{' '}
        <Typography.Text type="secondary">
          (* {RouletteStrategy.range})
        </Typography.Text>
      </Typography.Paragraph>

      <Typography.Paragraph
        strong={true}
        style={{
          fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
        }}
      >
        = {state.winningNumber}
        <Typography.Text type="secondary">
          .
          {
            (
              distributions
                .slice(0, 4)
                .reduce(
                  (previousValue, { float }) => previousValue + float,
                  0
                ) * RouletteStrategy.range
            )
              .toFixed(12)
              .split('.')[1]
          }
        </Typography.Text>
      </Typography.Paragraph>
    </Form>
  )
}
