import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  Row,
  Typography,
} from 'antd'
import Icon, {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  ThunderboltTwoTone,
  UserOutlined,
} from '@ant-design/icons'
import {
  selectBalance,
  selectSidebar,
  selectUser,
} from '../../containers/app/selectors'
import styled, { keyframes } from 'styled-components'

import { Balance } from '..'
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { show } from 'redux-modal'
import { toggleSidebar } from '../../containers/app/actions'

const brandAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(5deg) scale(1.2);
  }
`

const A = styled.a`
  &:hover svg {
    animation: ${brandAnimation} linear 1s infinite alternate;
  }
`

const AppHeader = ({ balance, show, user, sidebar, toggleSidebar }) => (
  <Layout.Header>
    <Row className={`app-header`} align="middle">
      <Col>
        <Link href="/">
          <A>
            <Row justify="start" align="top" style={{ height: '64px' }}>
              <Col flex="32px">
                <ThunderboltTwoTone
                  twoToneColor="#722ed1"
                  style={{ fontSize: '32px', padding: '16px 4px 16px 0' }}
                />
              </Col>
              <Col flex="auto">
                <Typography.Text
                  className="app-header-logo-text"
                  strong={true}
                  style={{ color: 'white' }}
                >
                  LIGHTNING JACKPOT
                </Typography.Text>
              </Col>
            </Row>
          </A>
        </Link>
      </Col>
      <Col>
        <div className="app-header-center">
          {user ? (
            <>
              <Balance balance={balance} />
              <Button
                type="primary"
                onClick={show('deposit')}
                icon={<PlusOutlined />}
                style={{ marginLeft: '8px' }}
              >
                Deposit
              </Button>
            </>
          ) : (
            <Link href="/register">
              <Button
                type="primary"
                style={{ fontWeight: 500 }}
                // onClick={show('login')}
              >
                Get started
              </Button>
            </Link>
          )}
        </div>
      </Col>

      <Col>
        <Row justify="end" align="middle">
          <Col style={{ textAlign: 'right' }}>
            {!user ? (
              <>
                <Link href="/login">
                  <a style={{ padding: '0 15px' }}>Login</a>
                </Link>
              </>
            ) : (
              user.get('name') && (
                <Dropdown
                  overlay={
                    <Menu>
                      {/* <Menu.Item key="0">
                      <a onClick={show('avatar')}>Change avatar</a>
                    </Menu.Item> */}
                      <Menu.Item key="1">
                        <a onClick={show('color')}>Edit color</a>
                      </Menu.Item>
                      <Menu.Item key="2">
                        <a onClick={show('name')}>Edit name</a>
                      </Menu.Item>
                      {/* <Menu.Item key="3">
                      <Link href="preferences">
                        <a>Preferences</a>
                      </Link>
                    </Menu.Item> */}
                      <Menu.Divider />
                      <Menu.Item key="3">
                        <a onClick={show('deposit')}>Deposit</a>
                      </Menu.Item>
                      <Menu.Item key="4">
                        <a onClick={show('withdraw')}>Withdraw</a>
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item key="5">
                        <Link href="bets">
                          <a>Bets</a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item key="6">
                        <Link href="transactions">
                          <a>Transactions</a>
                        </Link>
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item key="7">
                        <a href="/logout">Logout</a>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <div style={{ display: 'inline-block' }}>
                    <div className="app-header-desktop-dropdown">
                      {/* <Avatar
                      src={user.get('avatar')}
                      shape="square"
                      style={{
                        backgroundColor: user.get('color'),
                        verticalAlign: 'middle',
                      }}
                    >
                      {user.get('name')}
                    </Avatar> */}
                      <Button
                        type="default"
                        style={{
                          marginLeft: 8,
                          verticalAlign: 'middle',
                        }}
                      >
                        {user.get('name')} <DownOutlined />
                      </Button>
                    </div>

                    <div className="app-header-mobile-dropdown">
                      <Button type="link">
                        <UserOutlined />
                      </Button>
                    </div>
                  </div>
                </Dropdown>
              )
            )}
          </Col>
          <Col style={{ paddingLeft: 15 }} flex="16px">
            {sidebar ? (
              <MenuUnfoldOutlined className="trigger" onClick={toggleSidebar} />
            ) : (
              <MenuFoldOutlined className="trigger" onClick={toggleSidebar} />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  </Layout.Header>
)

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
  balance: selectBalance(),
  sidebar: selectSidebar(),
})

const mapDispatchToProps = dispatch => ({
  show: name => () => dispatch(show(name)),
  toggleSidebar: () => dispatch(toggleSidebar()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader)
