/* eslint-disable react/destructuring-assignment */

import { NexauthError, useAuth } from 'nexauth'
import { useRef, useState } from 'react'

export const SIGN_IN_MODAL_TYPE = {
  LOG_IN: 'LOG_IN',
  SIGN_UP: 'SIGN_UP',
}

type SignInModalProps = {
  onCancel?: () => void
  type?: string
}
export default function SignInModal(props: SignInModalProps) {
  const $form = useRef<HTMLFormElement>()
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [type, setType] = useState(props.type || SIGN_IN_MODAL_TYPE.LOG_IN)
  const auth = useAuth()

  const logIn = async () => {
    setIsSigningIn(true)
    setErrors({})

    const email = ($form.current.elements as any).email.value
    const password = ($form.current.elements as any).password.value

    const res = await auth.logIn(email, password)
    if (res.isError) {
      if (res.error.email !== undefined) {
        if (res.error.email === NexauthError.LOG_IN_WRONG_EMAIL_OR_PASSWORD) {
          setErrors({
            email: 'Wrong email and/or password.',
          })
        }
      }

      setIsSigningIn(false)

      return
    }

    if (props.onCancel) {
      props.onCancel()
    }
  }

  const signUp = async () => {
    setIsSigningIn(true)
    setErrors({})

    const email = ($form.current.elements as any).email.value
    const password = ($form.current.elements as any).password.value

    const newUserData = {
      email,
      password,
    }

    const res = await auth.signUp(newUserData)
    if (res.isError) {
      if (res.error.email !== undefined) {
        if (res.error.email === NexauthError.SIGN_UP_DUPLICATE_EMAIL) {
          setErrors({
            email: 'This email is taken.',
          })
        } else {
          console.error(res.error)
        }
      } else {
        console.error(res.error)
      }

      setIsSigningIn(false)

      return
    }

    switchToLogIn()
  }

  const switchToLogIn = () => {
    setErrors({})
    setIsSigningIn(false)
    setType(SIGN_IN_MODAL_TYPE.LOG_IN)
  }

  const switchToSignUp = () => {
    setErrors({})
    setIsSigningIn(false)
    setType(SIGN_IN_MODAL_TYPE.SIGN_UP)
  }

  return (
    <div
      aria-modal
      className="modal"
      role="dialog"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'block' }}
      tabIndex={-1}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {type === SIGN_IN_MODAL_TYPE.LOG_IN && (
              <h5 className="modal-title" data-test-id="modal-logInTitle">
                Log In
              </h5>
            )}
            {type === SIGN_IN_MODAL_TYPE.SIGN_UP && (
              <h5 className="modal-title" data-test-id="modal-signUpTitle">
                Sign Up
              </h5>
            )}

            {props.onCancel !== undefined && (
              <button
                aria-label="Close"
                className="btn-close"
                disabled={isSigningIn}
                onClick={props.onCancel}
                type="button"
              />
            )}
          </div>
          <div className="modal-body">
            {type === SIGN_IN_MODAL_TYPE.LOG_IN && (
              <p>
                Please{' '}
                <button
                  className="btn btn-link"
                  onClick={switchToSignUp}
                  style={{ border: 0, padding: 0, verticalAlign: 'inherit' }}
                  type="button"
                >
                  sign up
                </button>{' '}
                if you don’t have an account.
              </p>
            )}
            {type === SIGN_IN_MODAL_TYPE.SIGN_UP && (
              <p>
                Please{' '}
                <button
                  className="btn btn-link"
                  onClick={switchToLogIn}
                  style={{ border: 0, padding: 0, verticalAlign: 'inherit' }}
                  type="button"
                >
                  log in
                </button>{' '}
                if you already have an account.
              </p>
            )}

            <form key={type} ref={$form} noValidate>
              <div className="mb-3">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  autoComplete="email"
                  className={`form-control${errors.email !== undefined ? ' is-invalid' : ''}`}
                  disabled={isSigningIn}
                  id="email"
                  type="email"
                />
                {errors.email !== undefined && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-3">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="form-label" htmlFor="email">
                  Password
                </label>
                <input
                  autoComplete="current-password"
                  className={`form-control${errors.password !== undefined ? ' is-invalid' : ''}`}
                  disabled={isSigningIn}
                  id="password"
                  type="password"
                />
                {errors.password !== undefined && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </form>
          </div>
          <div className="modal-footer">
            {props.onCancel !== undefined && (
              <button className="btn btn-secondary" disabled={isSigningIn} onClick={props.onCancel} type="button">
                Cancel
              </button>
            )}

            {type === SIGN_IN_MODAL_TYPE.LOG_IN && (
              <button
                className="btn btn-primary"
                data-test-id="modal-logInButton"
                disabled={isSigningIn}
                onClick={logIn}
                type="button"
              >
                Log In
              </button>
            )}

            {type === SIGN_IN_MODAL_TYPE.SIGN_UP && (
              <button
                className="btn btn-primary"
                data-test-id="modal-signUpButton"
                disabled={isSigningIn}
                onClick={signUp}
                type="button"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
