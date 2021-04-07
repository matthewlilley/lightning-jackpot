import { Button, Layout } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { setSidebar, toggleSidebar } from '../../containers/app/actions'

import Chat from '../../containers/chat'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectSidebar } from '../../containers/app/selectors'
import { useState } from 'react'
// import { isMobile } from 'is-mobile'

function Sidebar({ sidebar, setSidebar, toggleSidebar }) {
  const [view, setView] = useState('chat')
  function onBreakpoint(broken) {
    console.log('onBreakpoint', { broken })
  }
  function onCollapse(collapsed, type) {
    console.log('onCollapse', { collapsed, type })
    // setSidebar(!collapsed)
  }

  return (
    <Layout.Sider
      // breakpoint="lg"
      className="app-sidebar"
      collapsed={!sidebar}
      // collapsed={true}
      collapsedWidth={0}
      collapsible={true}
      // defaultCollapsed={isMobile()}
      theme="light"
      trigger={null}
      onBreakpoint={onBreakpoint}
      onCollapse={onCollapse}
    >
      <div className="app-sidebar-content">
        <Layout.Header
          style={{
            display: 'flex',
            padding: '0 16px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'white', marginRight: 'auto' }}>
            {view.toUpperCase()}
          </span>
          <div>
            {/* <Button type='link' onClick={() => setView('chat')}>
              <Badge className='chat-header-badge' dot={false}>
                <Icon type='message' />
              </Badge>
            </Button>
            <Button type='link' onClick={() => setView('messages')}>
              <Badge className='chat-header-badge' dot={false}>
                <Icon type='mail' />
              </Badge>
            </Button>
            <Button type='link' onClick={() => setView('notifications')}>
              <Badge dot={true}>
                <Icon type='notification' />
              </Badge>
            </Button> */}
            <Button
              type="link"
              onClick={toggleSidebar}
              style={{
                paddingRight: 0,
              }}
            >
              <CloseOutlined />
            </Button>
          </div>
        </Layout.Header>
        {view === 'chat' && <Chat />}
        {view === 'messages' && <div>messages</div>}
        {view === 'notifications' && <div>notifications</div>}
      </div>
    </Layout.Sider>
  )
}

const mapStateToProps = createStructuredSelector({
  sidebar: selectSidebar(),
})

const mapDispatchToProps = dispatch => ({
  toggleSidebar: () => dispatch(toggleSidebar()),
  setSidebar: sidebar => dispatch(setSidebar(sidebar)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
