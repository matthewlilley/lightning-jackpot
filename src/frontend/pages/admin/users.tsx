import { Button, Card, Divider, Input, Table, Tag, Typography } from 'antd'
import { DownOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import React, { createRef } from 'react'

import AdminLayout from '../../components/layouts/admin'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'
import getConfig from 'next/config'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

class Users extends React.Component<any> {
  static Layout = AdminLayout
  static defaultProps = {
    users: [],
  }

  static async getInitialProps({ req, query }) {
    const response = await fetch(
      `${APP_URL}/api/v0/users${
        query.filter ? `?filter=${JSON.stringify(query.filter)}` : ''
      }`,
      {
        headers: {
          cookie: req ? req.headers.cookie : null,
        },
      }
    )
    console.log('res', response)
    const users = await response.json()
    return {
      users,
    }
  }

  state = {
    users: this.props.users,
    searchText: '',
  }

  searchInput: any = createRef()

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={this.searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined
        style={{ color: filtered ? 'rgb(114, 46, 209)' : undefined }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.trim().toLowerCase())
        : false,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.current.select())
      }
    },
    render: text =>
      text && (
        <Highlighter
          highlightStyle={{
            backgroundColor: 'rgb(114, 46, 209)',
            color: 'white',
            padding: 0,
          }}
          searchWords={[this.state.searchText]}
          autoEscape={true}
          textToHighlight={text}
        />
      ),
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }
  expandedRowRender = record => (
    <div>
      {record.meta.map((meta, index) => (
        <p key={index}>
          {meta.key} - {meta.value}
        </p>
      ))}
    </div>
  )
  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: name => name && <a>{name}</a>,
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        key: 'email',
        ...this.getColumnSearchProps('email'),
      },
      {
        dataIndex: 'balance',
        key: 'balance',
        title: 'Balance',
      },
      {
        dataIndex: 'tag',
        key: 'tag',
        title: 'Tag',
        render: tag =>
          tag && (
            <span>
              <Tag color={tag.color} key={tag}>
                {tag.text.toUpperCase()}
              </Tag>
            </span>
          ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a
              onClick={async () => {
                await fetch(`${APP_URL}/api/v0/users/${record.id}/lock`, {
                  method: 'PATCH',
                })
              }}
            >
              {!record.locked ? (
                <>
                  Lock <LockOutlined />
                </>
              ) : (
                <>
                  Unlock <UnlockOutlined />
                </>
              )}
            </a>
            <Divider type="vertical" />
            <a className="ant-dropdown-link">
              More actions <DownOutlined />
            </a>
          </span>
        ),
      },
    ]
    return (
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Typography.Title level={3}>Users</Typography.Title>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={this.props.users}
          expandedRowRender={this.expandedRowRender}
        />
      </Card>
    )
  }
}

Users.Layout = AdminLayout

export default Users
