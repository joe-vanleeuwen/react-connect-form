import React, { Component, PropTypes } from 'react'

const getChanges = (prev, next) => {
  if (!prev) {
    return
  }
  if (!Object.keys(prev).length) {
    return
  }
  return Object.keys(prev).reduce((changes, key) => {
    if (prev[key] !== next[key]) {
      if (Array.isArray(prev[key])) {
        if (prev[key].length !== next[key].length ||
            prev[key].some((item, index) => item !== next[key][index])) {
          changes.push(`\t${key}: ${JSON.stringify(prev[key])} => ${JSON.stringify(next[key])}`)
        }
      } else if (typeof prev[key] === 'object') {
        const childChanges = getChanges(prev[key], next[key])
        if (childChanges) {
          changes.push(key + '\n' + childChanges)
        }
      } else {
        changes.push(`\t${key}: ${JSON.stringify(prev[key])} => ${JSON.stringify(next[key])}`)
      }
    }
    return changes
  }, []).join('\n')
}

export default class Debug extends Component {
  static displayName = 'Debug'

  static contextTypes = {
    _form: PropTypes.object.isRequired
  }

  static propTypes = {
    name: PropTypes.string,
    fields: PropTypes.bool,
    render: PropTypes.bool,
    log: PropTypes.bool
  }

  static defaultProps = {
    log: true
  }

  constructor (props, context) {
    super(props, context)
    if (!context._form) throw new Error('Debug must be inside Form')
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const nextForm = nextContext._form
    return (
      Object.keys(nextProps).some(key => nextProps[key] !== this.props[key]) ||
      Object.keys(nextForm).some(key => nextForm[key] !== this.form[key])
    )
  }

  componentDidUpdate (prevProps, prevState, prevContext) {
    const { fields: prevFields, ...prevForm } = prevContext._form
    const { fields: nextFields, ...nextForm } = this.context._form
    if (this.props.log) {
      if (this.props.name) {
        console.log(getChanges(prevFields[name], nextFields[name]))
      } else if (this.props.fields) {
        console.log(getChanges(prevFields, nextFields))
      } else {
        console.log(getChanges(prevForm, nextForm))
      }
    }
  }

  get form () {
    return this.context._form
  }

  render () {
    const { fields, ...rest } = this.form
    if (!this.props.render) {
      return null
    }
    return (
      <pre>
        <code>
          {this.props.name ? (
            JSON.stringify(fields[name], null, 2)
          ) : this.props.field ? (
            JSON.stringify(fields, null, 2)
          ) : (
            JSON.stringify(rest, null, 2)
          )}
        </code>
      </pre>
    )
  }
}
