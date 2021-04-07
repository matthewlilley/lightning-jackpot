import { Badge, Button, Input, Layout, List, notification } from 'antd'
import React, { Component, createRef } from 'react'
import { loadMessages, sendMessage, setChat, toggleChat } from './actions'
import {
  selectError,
  selectLoading,
  selectMessages,
  selectOnline,
  selectRoom,
  selectVisible,
} from './selectors'

import { DiscordEmojiButton } from 'discord-emoji-button'
import Message from './message'
import { NimblePicker } from 'emoji-mart'
import ReactGA from 'react-ga'
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import data from 'emoji-mart/data/emojione.json'
import { selectUser } from '../app/selectors'
import { show } from 'redux-modal'

class Chat extends Component<any> {
  static defaultProps = {
    field: '',
    showEmojiPicker: false,
    view: 'chat',
  }

  chatInput: any = createRef()
  scrollbar: any = createRef()

  state = {
    field: this.props.field,
    showEmojiPicker: this.props.showEmojiPicker,
    view: this.props.view,
  }

  async componentDidMount() {
    console.log('Chat componentDidMount')
    if (this.state.view === 'chat') {
      this.props.loadMessages()
      if (this.props.messages.length) {
        this.scrollbar.current.scrollToBottom()
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.messages !== prevProps.messages) {
      this.scrollbar.current.scrollToBottom()
    }
  }

  handleChange = event => {
    this.setState({ field: event.target.value })
  }

  // send messages to server and add them to the state
  handleSubmit = event => {
    event.preventDefault()

    if (!this.props.user) {
      notification.error({
        message: 'You need to login before sending a message',
      })
      return
    }

    console.log('handleMessage', event)
    if (this.state.field === '') {
      return
    }
    // const message = {
    //   type: 'user',
    //   author: this.props.user ? this.props.user.get('name') : 'Anon',
    //   color: this.props.user
    //     ? this.props.user.get('color')
    //     : 'rgb(107, 70, 193)',
    //   value: this.state.field
    // };
    this.props.sendMessage(this.state.field)
    this.setState({ field: '' })

    // Log message to Google Analytics
    ReactGA.event({ category: 'chat', action: 'submit_message' })
  }

  handleEmojiSelect = emoji => {
    this.setState({
      field: this.state.field.concat(emoji.colons),
      showEmojiPicker: false,
    })
    const input: any = document.getElementById('chat-input')
    if (input) {
      input.focus()
      input.setSelectionRange(this.state.field.length, this.state.field.length)
    }
  }

  handleClick = event => {
    this.setState({
      showEmojiPicker: !this.state.showEmojiPicker,
    })
  }

  handleFocus = event => {
    console.log('handleFocus', this.state.showEmojiPicker)
    if (this.state.showEmojiPicker) {
      this.setState({ showEmojiPicker: false })
    }
  }

  onMouseEnter = () => {
    // if (!this.props.user) {
    //   this.props.show('login')
    // }
    this.chatInput.current.focus()
  }

  onMouseLeave = () => this.chatInput.current.blur()

  render() {
    return (
      <div className="chat">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <Scrollbars
            autoHide={true}
            autoHideTimeout={1000}
            autoHideDuration={200}
            universal={true}
            ref={this.scrollbar}
            // style={{
            //   marginRight: '-17px',
            //   marginBottom: '-17px',
            // }}
          >
            <List
              size="small"
              dataSource={this.props.messages}
              renderItem={(message, index) => (
                <Message key={index} message={message} />
              )}
            />
          </Scrollbars>
          {this.state.showEmojiPicker && (
            <NimblePicker
              color="rgb(255, 237, 74)"
              title="Lightning Jackpot"
              sheetSize={32}
              showPreview={false}
              showSkinTones={false}
              onSelect={this.handleEmojiSelect}
              style={{ width: '100%' }}
              set="emojione"
              data={data}
            />
          )}
          <form
            className="chat-form"
            onSubmit={this.handleSubmit}
            // onMouseEnter={this.handleFocus}
            style={{
              padding: '20px 16px',
              borderTop: '1px solid #e8e8e8',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Input
                id="chat-input"
                size="large"
                onChange={this.handleChange}
                ref={this.chatInput}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                placeholder="Hello world!"
                value={this.state.field}
                style={{
                  padding: '6px 48px 6px 11px',
                }}
              />

              <DiscordEmojiButton
                onClick={this.handleClick}
                // size={60}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '11px',
                  bottom: '8px',
                }}
              />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  visible: selectVisible(),
  error: selectError(),
  loading: selectLoading(),
  messages: selectMessages(),
  online: selectOnline(),
  room: selectRoom(),
  user: selectUser(),
})

const mapDispatchToProps = dispatch => ({
  sendMessage: value => dispatch(sendMessage(value)),
  loadMessages: () => dispatch(loadMessages()),
  show: modal => dispatch(show(modal)),
  toggleChat: () => dispatch(toggleChat()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
