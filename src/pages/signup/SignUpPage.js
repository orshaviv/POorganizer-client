import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import styled from 'styled-components';

import './SignUpPage.scss';
import { inject } from 'mobx-react';
import ErrorMessage from '../../components/ErrorMessage';

const Heading = styled.h1`
  margin-top: 0;
`;

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  background-color: #edf4ff;
  padding: 30px;
  border-radius: 5px;
`;

const FormField = styled(TextField)`
  width: 100%;
`;

@inject('userStore', 'routerStore')
class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      firstName: null,
      lastName: null,
      headerLogo: null,
      footerLogo: null,
      errorMessage: null,
    };
  }

  submit = async () => {
    const { username, password, email, firstName, lastName, headerLogo, footerLogo } = this.state;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('headerLogo', headerLogo);
    formData.append('footerLogo', footerLogo);

    console.log(headerLogo);
    console.log(footerLogo);
    try {
      await this.props.userStore.signup(formData);
      this.props.routerStore.push('/signin');
    } catch (error) {
      const errorMessage = error.response.data.message;
      this.setState({ errorMessage });
    }
  };

  render() {
    const { errorMessage } = this.state;

    return (
      <div className="fullscreen-wrapper">
        <FormContainer>
          <Heading>Join us!</Heading>
          <p>Start managing purchase orders easily.</p>

          {errorMessage && <ErrorMessage message={this.state.errorMessage} />}

          <div>
            <FormField
              id="outlined-name"
              label="Username"
              margin="dense"
              variant="outlined"
              onChange={e => this.setState({ username: e.target.value })}
            />
          </div>
          <div>
            <FormField
                id="outlined-name"
                label="Email"
                margin="dense"
                variant="outlined"
                onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          <div>
            <FormField
                id="outlined-name"
                label="First Name"
                margin="dense"
                variant="outlined"
                onChange={e => this.setState({ firstName: e.target.value })}
            />
          </div>
          <div>
            <FormField
                id="outlined-name"
                label="Last Name"
                margin="dense"
                variant="outlined"
                onChange={e => this.setState({ lastName: e.target.value })}
            />
          </div>
          <div>
            <FormField
              id="outlined-name"
              label="Password"
              margin="dense"
              variant="outlined"
              type="password"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <p>
            Passwords must contain at least 1 upper case letter, 1 lower case letter and one number OR special character.
          </p>

          <div>
            <label>Upload Header Logo</label> &nbsp;
            <input type={'file'}
                   name={'headerLogo'}
                   onChange={e => this.setState({ headerLogo: e.target.files[0] })}
            />
          </div>
          &nbsp;
          <div>
            <label>Upload Footer Logo</label> &nbsp;
            <input type={'file'}
                   name={'footerLogo'}
                   onChange={e => this.setState({ footerLogo: e.target.files[0] })}
            />
          </div>

          <div>
            <hr/>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.submit}
            >
              SIGN UP
            </Button>
          </div>

        </FormContainer>
      </div>
    );
  }
}

export default SignUpPage;
