import React from "react"
import SignUp from "./signup"
import SignIn from "./signin"

export default class IndexPage extends React.Component {
  render() {
    const default_user_pool_client = "6v522mjapeicf8ctbda4bu9dhi"
    const no_verify_user_pool_client = "48n2qjv0c8shijj4b8h8of7qek"
    return (
      <div>
        <h2>Default User Pool</h2>
        <h4>Sign Up</h4>
        <SignUp clientid={default_user_pool_client} />
        <h4>Sign In</h4>
        <SignIn clientid={default_user_pool_client} />
        <hr />
        <h2>No-Verify User Pool</h2>
        <h4>Sign Up</h4>
        <SignUp clientid={no_verify_user_pool_client} />
        <h4>Sign In</h4>
        <SignIn clientid={no_verify_user_pool_client} />
      </div>
    )
  }
}
