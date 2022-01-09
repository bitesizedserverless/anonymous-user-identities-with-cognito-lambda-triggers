import React from "react"
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider"

const client = new CognitoIdentityProviderClient({ region: "eu-west-1" })

export default class Validation extends React.Component {
  constructor(props) {
    super(props)
    this.state.clientid = props.clientid
    this.state.username = props.username
  }

  state = {
    username: "",
    validationtoken: "",
    error: null,
    succeeded: null,
  }

  handleInputChange = event => {
    this.setState({
      error: null,
      userconfirmed: null,
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
      ConfirmationCode: this.state.validationtoken,
    }
    const command = new ConfirmSignUpCommand(input)
    client
      .send(command)
      .then(res => {
        this.setState({
          succeeded: true,
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
                <td width={120}>Validation Token</td>
                <td>
                  <input
                    type="text"
                    name="validationtoken"
                    value={this.state.validationtoken}
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

        {this.state.succeeded && (
          <p style={{ color: "green" }}>Validation Succeeded</p>
        )}
      </div>
    )
  }
}
