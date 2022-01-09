import React from "react"
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider"

const client = new CognitoIdentityProviderClient({ region: "eu-west-1" })

export default class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state.clientid = props.clientid
  }

  state = {
    username: "",
    password: "",
    error: null,
    accesstoken: null,
    idtoken: null,
    refreshtoken: null,
  }

  handleInputChange = event => {
    this.setState({
      error: null,
    })

    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.setState({
      error: null,
      accesstoken: null,
      idtoken: null,
      refreshtoken: null,
    })

    const input = {
      ClientId: this.state.clientid,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: this.state.username,
        PASSWORD: this.state.password,
      },
    }
    const command = new InitiateAuthCommand(input)
    client
      .send(command)
      .then(res => {
        console.log(res)
        this.setState({
          accesstoken: res.AuthenticationResult.AccessToken,
          idtoken: res.AuthenticationResult.IdToken,
          refreshtoken: res.AuthenticationResult.RefreshToken,
        })
      })
      .catch(res => {
        this.setState({ error: res.message })
      })
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td width={120}>Username</td>
                <td>
                  <input
                    type="text"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td width={120}>Password</td>
                <td>
                  <input
                    type="text"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                  />
                </td>
                <td colSpan={2} align="right">
                  <button type="submit">Submit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        {this.state.error && <p style={{ color: "red" }}>{this.state.error}</p>}
        {this.state.accesstoken && (
          <p style={{ color: "green" }}>
            Login successful. Your access token has been saved.
          </p>
        )}
      </div>
    )
  }
}
