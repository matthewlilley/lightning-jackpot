import { Button, Dropdown, List, Menu, Tag } from 'antd'
import { GoldOutlined } from '@ant-design/icons'

import { EmojioneV4 } from 'react-emoji-render'
import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import moment from 'moment'
import { selectUser } from '../app/selectors'
import { setTipRecipient } from '../app/actions'
import { show } from 'redux-modal'

export class MessageListItem extends React.PureComponent<any> {
  tip = () => {
    // console.log('tip', this.props.message.author);
    this.props.setTipRecipient(this.props.message.author)
    this.props.show('tip')
  }
  render() {
    return (
      <List.Item
        className="message"
        style={{ paddingLeft: 16, paddingRight: 16 }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: 8,
            }}
          >
            {this.props.message.author && (
              <Dropdown
                disabled={this.props.message.author === 'Anon'}
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Button
                        icon={<GoldOutlined />}
                        type="link"
                        htmlType="button"
                        onClick={this.tip}
                      >
                        Tip
                      </Button>
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <a
                  className="ant-dropdown-link"
                  href="#"
                  style={{
                    fontWeight: 600,
                    color: this.props.message.color || 'inherit',
                    marginRight: 8,
                  }}
                >
                  {this.props.message.author}
                </a>
              </Dropdown>
            )}
            {this.props.message.tags &&
              this.props.message.tags.map((tag, index) => (
                <Tag key={index} color={tag.color}>
                  {tag.text}
                </Tag>
              ))}
            <small>{moment.unix(this.props.message.id).fromNow()}</small>
            {/* <small>BAN</small> */}
          </div>
          <EmojioneV4
            className="chat-text"
            onlyEmojiClassName="chat-emoji-large"
            text={this.props.message.value}
          />
        </div>
      </List.Item>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
})

const mapDispatchToProps = dispatch => ({
  show: modal => {
    dispatch(show(modal))
  },
  setTipRecipient: recipient => {
    dispatch(setTipRecipient(recipient))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageListItem)
