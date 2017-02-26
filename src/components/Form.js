import React, { Component, PropTypes } from 'react'
import { update } from '../utils'

export default class Form extends Component {

  static displayName = 'Form'

  static propTypes = {
    onSubmit: PropTypes.func
  }

  static childContextTypes = {
    _form: PropTypes.object.isRequired
  }

  state = {
    fields: {}
  }

  validators = {}

  getChildContext() {
    return {
      _form: {
        unregisterField: this.unregisterField,
        registerField: this.registerField,
        changeField: this.changeField,
        focusField: this.focusField,
        blurField: this.blurField,
        getField: this.getField
      }
    }
  }

  get values() {
     return Object.keys(this.state.fields).reduce((values, name) => {
       if (!this.state.fields[name].value) return values
       return { ...values, [name]: this.state.fields[name].value }
     }, {})
   }

   get pristine() {
     return Object.keys(this.state.fields).reduce((pristine, name) => {
       return pristine ? this.state.fields[name].pristine : false
     }, true)
   }

   get touched() {
     return Object.keys(this.state.fields).reduce((touched, name) => {
       return touched ? true : this.state.fields[name].touched
     }, false)
   }

   get focused() {
     return Object.keys(this.state.fields).reduce((focused, name) => {
       return focused ? focused : this.state.fields[name].focused ? name : null
     }, null)
   }

  registerField = (name, validators) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: { $merge: {
          [name]: {
            value: null,
            errors: [],
            touched: false,
            focused: false,
            pristine: true,
            validated: true,
            validating: false,
          }
        }}
      })
    })
    this.validators[name] = validators || []
  }

  unregisterField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: { $unset: [name] }
      })
    })
    delete this.validators[name]
  }

  getField = (name) => {
    return this.state.fields[name]
  }

  changeField = (name, value) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: { $merge: {
            value: value,
            touched: true,
            validated: value === prevState.fields[name].value,
            // TODO: handle initialValues and defaultValues
            pristine: !!(this.props.initialValues && this.props.initialValues[name] === value)
          }}
        }
      })
      // TODO: merge synchronous validation changes
      if (this.state.fields[name].errors.length) {
        this.validateField(name, value)
      }
    })
  }

  focusField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: {
            focused: { $set: true }
          }
        }
      })
    })
  }

  blurField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: { $merge: {
            focused: false,
            touched: true
          }}
        }
      })
    })
    this.validateField(name, this.state.fields[name].value)
  }

  // TODO: better name (also unwarns field)
  warnField = (name, errors, validating) => {
    errors = errors.filter(err => err).map(err => err.message || err)
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: { $merge: {
            errors: errors,
            validating: validating,
            validated: !errors.length && !validating,
          }}
        }
      })
    })
  }

  // TODO: merge blur/change updates into sync updates
  validateField = (name, value) => {
    if (!this.shouldFieldValidate(name, value)) {
      return
    }
    //  TODO: shouldFieldValidate()
    // TODO: how should user build async errors? Promise.reject/resolve()
    const { syncErrors, asyncErrors } = this.runFieldValidations(name, value)
    const isAsync = asyncErrors.length > 0
    this.warnField(name, syncErrors, isAsync)
    if (isAsync) {
      // update field for first error when there are multiple async errors.
      if (asyncErrors.length > 1) {
        // wait for first error to resolve.
        Promise.race(asyncErrors.map(p => p.catch(e => e)))
          // update field after first error resolves.
          .then(error => this.warnField(name, [...error, ...syncErrors], true))
      }
      // wait for all errors to resolve.
      Promise.all(asyncErrors.map(p => p.catch(e => e)))
        .then(errors => this.warnField(name, [...errors, ...syncErrors], false))
    }
  }

  shouldFieldValidate = (name, nextValue) => {
    const { value, validated } = this.state.fields[name]
    if (validated)
      return false
    return true
  }

  runFieldValidations = (name, value) => {
    return this.validators[name].reduce((errors, validator) => {
      let err = validator(value, this.values)
      if (!err) {
        return errors
      } else if (typeof err === 'string' || err instanceof Error) {
        errors.syncErrors.push(err)
      } else if (typeof err.then === 'function') {
        errors.asyncErrors.push(err)
      } else {
        throw new Error('validation must return a String, Error, or Promise')
      }
      return errors
    }, { syncErrors: [], asyncErrors: [] })
  }

  submit = () => {
    this.props.onSubmit(this.state.fields)
  }

  reset = () => {

  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <pre>
          <code>
            {JSON.stringify({
              "touched": this.touched,
              "pristine": this.pristine,
              "focused": this.focused,
              "fields": this.state.fields,
              "values": this.values,
            }, null, 2)}
          </code>
        </pre>
        {this.props.children}
      </form>
    )
  }

}
