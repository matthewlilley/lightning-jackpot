import { Form, Modal } from 'antd'
import React, { Component } from 'react'
import { connectModal, hide } from 'redux-modal'
import { formValueSelector, reduxForm } from 'redux-form/immutable'

import { GithubPicker } from 'react-color'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { presetPalettes } from '@ant-design/colors'
import { selectColor } from '../containers/app/selectors'
import { setColor } from '../containers/app/actions'

const selector = formValueSelector('color')

const initialValues = createStructuredSelector({
  color: selectColor(),
})

const mapStateToProps = createStructuredSelector({
  color: state => selector(state, 'color'),
  initialValues,
})

const mapDispatchToProps = dispatch => ({
  color: color => dispatch(setColor(color)),
  hide: () => dispatch(hide('color')),
})

const ColorForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'color',
    enableReinitialize: true,
  })(({ color, hide }) => {
    function handleChangeComplete({ hex }) {
      color(hex)
      hide()
    }
    return (
      <Form>
        <GithubPicker
          colors={Object.values(presetPalettes).reduce(
            (currentValue, previousValue) => [
              ...previousValue,
              ...currentValue,
            ],
            []
          )}
          triangle="hide"
          onChangeComplete={handleChangeComplete}
        />
      </Form>
    )
  })
)

export default connectModal({
  name: 'color',
  destroyOnHide: true,
  getModalState: state => state.get('modal'),
})(({ handleHide, show }) => {
  return (
    <Modal
      title="Color"
      centered={true}
      visible={show}
      onCancel={handleHide}
      footer={null}
      width={324}
      className="color-modal"
    >
      <ColorForm />
    </Modal>
  )
})
