import { Button, Form, Modal, Slider } from 'antd'
import React, { Component, Fragment, createRef } from 'react'
import { formValueSelector, reduxForm } from 'redux-form/immutable'
import { SaveOutlined } from '@ant-design/icons'
import { Dropzone } from '../components'
import ReactAvatarEditor from 'react-avatar-editor'
import { connect } from 'react-redux'
import { connectModal } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { selectUser } from '../containers/app/selectors'
import { setAvatar } from '../containers/app/actions'

class AvatarModal extends Component<any> {
  state = {
    image: null,
    allowZoomOut: false,
    position: { x: 0.5, y: 0.5 },
    scale: '1',
    rotate: 0,
    borderRadius: 0,
    preview: null,
    width: 250,
    height: 250,
    loading: false,
  }
  editor: any = createRef()

  submit = values => {
    this.props.dispatch(
      setAvatar(
        this.editor.current.getImageScaledToCanvas().toDataURL('image/jpeg')
      )
    )
    this.props.handleHide()
  }

  handleImage = e => {
    console.log('handleImage')
    this.setState({ image: e.target.files[0] })
  }

  handleDrop = acceptedFiles => {
    console.log('acceptedFiles', acceptedFiles)
    this.setState({ image: acceptedFiles[0] })
  }

  handleScale = value => {
    this.setState({ scale: parseFloat(value) })
  }

  handlePositionChange = position => {
    this.setState({ position })
  }

  render() {
    const {
      show,
      handleSubmit,
      handleHide,
      avatar,
      submitting,
      pristine,
    } = this.props
    return (
      <Modal
        title="Avatar"
        centered={true}
        visible={show}
        onCancel={handleHide}
        footer={null}
        width={348}
      >
        <Form onFinish={handleSubmit(this.submit)}>
          {this.state.image && (
            <ReactAvatarEditor
              ref={this.editor}
              scale={parseFloat(this.state.scale)}
              width={this.state.width}
              height={this.state.height}
              position={this.state.position}
              onPositionChange={this.handlePositionChange}
              // rotate={parseFloat(this.state.rotate)}
              borderRadius={this.state.width / (100 / this.state.borderRadius)}
              // onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
              // onLoadSuccess={this.logCallback.bind(this, 'onLoadSuccess')}
              // onImageReady={this.logCallback.bind(this, 'onImageReady')}
              image={this.state.image}
              className="editor-canvas"
              style={{ marginBottom: '1rem' }}
            />
          )}
          <Dropzone onDrop={this.handleDrop} />
          {this.state.image && (
            <Fragment>
              <label style={{ margin: '16px 0 8px' }}>Zoom:</label>
              <Slider
                onChange={this.handleScale}
                min={this.state.allowZoomOut ? 0.1 : 1}
                max={2}
                step={0.01}
                defaultValue={1}
                style={{ marginBottom: 16 }}
              />
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                block={true}
                disabled={!this.state.image || submitting}
                style={{ marginTop: 8 }}
              >
                Submit
              </Button>
            </Fragment>
          )}
        </Form>
      </Modal>
    )
  }
}

const selector = formValueSelector('avatar')

const mapStateToProps = createStructuredSelector({
  avatar: state => selector(state, 'avatar'),
  user: selectUser(),
})

export default reduxForm({
  form: 'avatar',
})(
  connect(mapStateToProps)(
    connectModal({
      name: 'avatar',
      destroyOnHide: true,
      getModalState: state => state.get('modal'),
    })(AvatarModal)
  )
)
