import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Typography,
} from 'antd'
import Icon, {
  FacebookFilled,
  ThunderboltOutlined,
  TwitterSquareFilled,
} from '@ant-design/icons'

import { Discord } from 'styled-icons/fa-brands'
import { NextSeo } from 'next-seo'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import getConfig from 'next/config'
import { selectUser } from '../containers/app/selectors'
import styled from 'styled-components'

const { publicRuntimeConfig } = getConfig()

const { APP_URL, APP_API_VERSION } = publicRuntimeConfig

export const StyledDiscord = styled(Discord)`
  color: #55acee;
  margin-right: 10px;
  font-size: 14px;
`

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
})

export default connect(mapStateToProps)((props: any) => {
  const [form] = Form.useForm()
  function handleSubmit(e) {
    // e.preventDefault()
    form.validateFields(['subject', 'text']).then(data => {
      // if (error) {
      //   console.error('Validation Error:', error)
      //   return
      // }
      console.log('Received values of form: ', data)
      fetch(`${APP_URL}/api/${APP_API_VERSION}/contact`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
        .then(response => {
          console.log('Success:', response)
          form.resetFields()
          const modal = Modal.success({
            title: 'Thanks!',
            content: 'Your message has been sent.',
          })
          setTimeout(() => {
            modal.destroy()
          }, 5000)
        })
        .catch(error => console.error('Error:', error))
    })
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <NextSeo title="Contact" />
      <Typography.Title level={1}>Contact</Typography.Title>
      <Row gutter={16}>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 16, offset: 0 }}>
          <Card title="Message" bordered={false}>
            {!props.user ? (
              <Form.Item>
                <Alert
                  message={`You'll need to login before sending a message.`}
                  type="info"
                  banner={true}
                  showIcon={false}
                />
              </Form.Item>
            ) : (
              <Form
                onFinish={handleSubmit}
                size="large"
                form={form}
                layout="vertical"
              >
                <Form.Item label="Subject">
                  <Form.Item
                    name="subject"
                    noStyle
                    rules={[{ required: true, message: 'Subject is required' }]}
                  >
                    <Input placeholder="Subject" size="large" />
                  </Form.Item>
                </Form.Item>

                <Form.Item label="Message">
                  <Form.Item
                    name="text"
                    noStyle
                    rules={[{ required: true, message: 'Message is required' }]}
                  >
                    <Input.TextArea rows={4} placeholder="Message..." />
                  </Form.Item>
                </Form.Item>

                <Form.Item style={{ margin: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<ThunderboltOutlined />}
                    disabled={!props.user}
                    size="large"
                  >
                    Send
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <Card title="Social" bordered={false}>
            <div>
              <Icon style={{ color: '#7289da', marginRight: 10 }}>
                <Discord size="1rem" />
              </Icon>
              <a
                href="https://discord.gg/yHBCsAg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join
              </a>
            </div>
            <div>
              <FacebookFilled style={{ color: '#3b5999', marginRight: 10 }} />
              <a
                href="https://facebook.com/LightningJackpot"
                target="_blank"
                rel="noopener noreferrer"
              >
                @LightningJackpot
              </a>
            </div>
            <div>
              <TwitterSquareFilled
                style={{ color: '#55acee', marginRight: 10 }}
              />
              <a
                href="https://twitter.com/LNJackpot"
                target="_blank"
                rel="noopener noreferrer"
              >
                @LNJackpot
              </a>
            </div>
            {/* <div>
                  IRC <a>#LightningJackpot</a>
                </div> */}
          </Card>
        </Col>
      </Row>
    </div>
  )
})
