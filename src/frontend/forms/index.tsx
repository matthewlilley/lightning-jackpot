import { Form, Input, InputNumber, Radio } from 'antd'

export const validateStatus = meta => {
  if (meta.success) {
    return 'success'
  }
  if (meta.warning) {
    return 'warning'
  }
  if (meta.asyncValidating) {
    return 'validating'
  }
  if (meta.error) {
    return 'error'
  }
}

export const renderField = Component => ({
  // Redux form props
  // https://redux-form.com/8.2.2/docs/api/field.md/#input-props
  input,
  // https://redux-form.com/8.2.2/docs/api/field.md/#meta-props
  meta,
  children,
  label,
  // Antd props below this point
  hasFeedback,
  ...rest
}) => {
  return (
    <Form.Item
      {...rest}
      label={label}
      validateStatus={
        meta.touched && meta.invalid ? validateStatus(meta) : undefined
      }
      hasFeedback={meta.touched && meta.invalid && hasFeedback}
      help={meta.touched && meta.invalid && meta.error}
    >
      <Component {...input} {...rest}>
        {children}
      </Component>
    </Form.Item>
  )
}

export const TextAreaField = renderField(Input.TextArea)

export const InputField = renderField(Input)

export const NumberField = renderField(InputNumber)

export const RadioGroupField = renderField(Radio.Group)

export { BetForm } from './bet'
export { LoginForm } from './login'
export { PreferencesForm } from './preferences'
