import { Component } from 'react';

import fetchApi from '../../utils/fetchApi';
import './Signin.css';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
    };
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem('token', token);
  };

  onSubmitSignIn = () => {
    fetchApi('http://localhost:3001/signin', 'post', {
      email: this.state.signInEmail,
      password: this.state.signInPassword,
    })
      .then((data) => {
        if (data.userId && data.success === 'true') {
          this.saveAuthTokenInSession(data.token);
          fetchApi(
            'http://localhost:3001/profile/' + data.userId,
            'get',
            null,
            data.token
          ).then((user) => {
            if (user && user.email) {
              this.props.loadUser(user);
              this.props.onRouteChange('home');
            }
          });
        }
      })
      .catch(console.log);
  };

  render() {
    const { onRouteChange } = this.props;

    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange('register')}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default SignIn;
