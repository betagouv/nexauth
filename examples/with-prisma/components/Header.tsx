import { useAuth } from 'nexauth/client'
import Link from 'next/link'
import { useState } from 'react'

import SignInModal, { SIGN_IN_MODAL_TYPE } from './SignInModal'

export default function Header() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [signInModalType, setSignInModalType] = useState(SIGN_IN_MODAL_TYPE.LOG_IN)
  const auth = useAuth()

  const closeSignInModal = () => {
    setIsSignInModalOpen(false)
  }

  const openLogInModal = () => {
    setSignInModalType(SIGN_IN_MODAL_TYPE.LOG_IN)
    setIsSignInModalOpen(true)
  }

  const openSignUpModal = () => {
    setSignInModalType(SIGN_IN_MODAL_TYPE.SIGN_UP)
    setIsSignInModalOpen(true)
  }

  return (
    <>
      <div className="container">
        <header className="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
          <Link href="/">
            <span
              className="col-3 d-flex align-items-center text-dark text-decoration-none"
              style={{ cursor: 'pointer' }}
            >
              <span className="fs-4">Nexauth With Prisma</span>
            </span>
          </Link>

          <ul className="col-auto nav nav-pills">
            <li className="nav-item">
              <Link href="/">
                <span className="nav-link" style={{ cursor: 'pointer' }}>
                  Home
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/profile">
                <span className="nav-link" style={{ cursor: 'pointer' }}>
                  Profile
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin">
                <span className="nav-link" style={{ cursor: 'pointer' }}>
                  Administration
                </span>
              </Link>
            </li>
          </ul>

          <div className="col-3 text-end">
            {auth.state.isAuthenticated ? (
              <button
                className="btn btn-outline-primary"
                data-test-id="header-logOutButton"
                onClick={auth.logOut}
                type="button"
              >
                Log Out
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-primary me-2"
                  data-test-id="header-logInButton"
                  onClick={openLogInModal}
                  type="button"
                >
                  Log In
                </button>
                <button
                  className="btn btn-primary"
                  data-test-id="header-signUpButton"
                  onClick={openSignUpModal}
                  type="button"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </header>
      </div>

      {isSignInModalOpen && <SignInModal onCancel={closeSignInModal} type={signInModalType} />}
    </>
  )
}
