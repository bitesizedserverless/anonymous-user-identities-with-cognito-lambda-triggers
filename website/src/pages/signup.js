import React from "react"
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider"
import Validation from "./validation"

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
    usersub: null,
    userconfirmed: null,
  }

  handleInputChange = event => {
    this.setState({
      error: null,
      userconfirmed: null,
      usersub: null,
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
      usersub: null,
    })

    const input = {
      ClientId: this.state.clientid,
      Username: this.state.username,
      Password: this.state.password,
    }
    const command = new SignUpCommand(input)
    client
      .send(command)
      .then(res => {
        this.setState({
          usersub: res.UserSub,
          userconfirmed: res.UserConfirmed,
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
        {this.state.usersub && (
          <p style={{ color: "green" }}>
            User created in Cognito. Your sub: {this.state.usersub}
          </p>
        )}
        {this.state.userconfirmed === false && (
          <Validation
            clientid={this.state.clientid}
            username={this.state.username}
          />
        )}
      </div>
    )
  }
}
