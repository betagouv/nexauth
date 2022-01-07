import useAuth from 'nexauth/dist/hooks/useAuth'

export default function IndexPage() {
  const auth = useAuth()

  return (
    <>
      <h1>Profile</h1>
      <p>{auth.state.isAuthenticated ? `Connected as ${auth.user?.email}` : `Not connected`}</p>
    </>
  )
}
