import React, { Component, PropTypes } from "react"
import { deepEqual, getEventValue } from "../utils"

export default class Field extends Component {
  static displayName = "Field"

  static contextTypes = {
    _form: PropTypes.object.isRequired,
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    render: PropTypes.func,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    validators: PropTypes.array,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  }

  static defaultProps = {
    component: "input",
    validators: [],
  }

  constructor(props, context) {
    super(props, context)
    if (!context._form) {
      throw new Error("Field must be inside Form")
    }
  }

  componentWillMount() {
    this.context._form.registerField(this.props.name, this.props)
  }

  componentWillUnmount() {
    this.context._form.unregisterField(this.props.name, this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.context._form.unregisterField(this.props.name, this.props)
      this.context._form.registerField(nextProps.name, nextProps)
    }
    if (
      !deepEqual(nextProps.initialValue, this.props.initialValue) ||
      nextProps.initialChecked !== this.props.initialChecked
    ) {
      this.context._form.resetField(nextProps.name, nextProps)
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const nextField = nextContext._form.fields[nextProps.name]
    const nextValues = nextContext._form.values
    if (!this.field) return true
    return (
      Object.keys(nextProps).some(key => nextProps[key] !== this.props[key]) ||
      Object.keys(nextField).some(key => nextField[key] !== this.field[key]) ||
      Object.keys(nextValues).some(key => nextValues[key] !== this.values[key])
    )
  }

  get field() {
    return this.context._form.fields[this.props.name]
  }

  get values() {
    return this.context._form.values
  }

  get value() {
    if (this.props.type === "radio" || this.props.type === "checkbox") {
      if (this.props.value === undefined) {
        return true
      }
      return this.props.value
    }
    if (
      this.props.type === "text" ||
      this.props.type === "email" ||
      this.props.type === "password"
    ) {
      return this.field.value || ""
    }
    return this.field.value
  }

  get checked() {
    if (this.props.type === "radio" || this.props.type === "checkbox") {
      if (Array.isArray(this.field.value)) {
        return this.field.value.indexOf(this.value) > -1
      } else {
        return this.field.value === this.value
      }
    }
  }

  get valid() {
    return this.field.errors.length < 1
  }

  handleChange = e => {
    const value = getEventValue(e, this.props)
    if (this.props.onChange && this.props.onChange(e) === false) return
    this.context._form.changeField(this.props.name, value)
  }

  handleFocus = e => {
    if (this.props.onFocus && this.props.onFocus(e) === false) return
    this.context._form.focusField(this.props.name)
  }

  handleBlur = e => {
    if (this.props.onBlur && this.props.onBlur(e) === false) return
    this.context._form.blurField(this.props.name)
  }

  render() {
    if (!this.field) return null
    const {
      initialChecked,
      initialValue,
      validators,
      component,
      render,
      ...rest
    } = this.props
    const inputProps = {
      ...rest,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      checked: this.checked,
      value: this.value,
    }
    const passProps = {
      values: this.values,
      ...this.field,
      ...inputProps,
    }
    if (typeof render === "function") {
      return render(passProps)
    } else if (typeof component === "string") {
      return React.createElement(component, inputProps)
    } else if (component) {
      return React.createElement(component, passProps)
    } else {
      return null
    }
  }
}
