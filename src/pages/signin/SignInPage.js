import React, {Component} from 'react';
import {Button, TextField} from '@material-ui/core';
import styled from 'styled-components';

import './SignInPage.scss';
import {inject, observer} from 'mobx-react';
import ErrorMessage from '../../components/ErrorMessage';
import {guestCredentials} from '../../default'

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
class SignInPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMesssage: null,
        };
    }

    submit = async () => {
        this.setState({errorMessage: null});
        const {username, password} = this.state;

        try {
            await this.props.userStore.signin(username, password);
            this.props.routerStore.push('/purchaseorders');
        } catch (error) {
            const errorMessage = error.response.data.message;
            this.setState({errorMessage});
        }
    };

    goToSignUp = () => {
        this.props.routerStore.push('/signup')
    };

    signInAsGuest = async () => {
        await this.setState({
            username: guestCredentials.username,
            password: guestCredentials.password,
        });

        await this.submit();
    }

    render() {
        const {errorMessage} = this.state;

        return (
            <div className="fullscreen-wrapper">
                <FormContainer>
                    <Heading>Hello!</Heading>
                    <p>Fill in your username and password to sign in.</p>

                    {errorMessage && <ErrorMessage message={this.state.errorMessage}/>}

                    <div>
                        <FormField
                            id="outlined-name"
                            label="Username"
                            margin="dense"
                            variant="outlined"
                            onChange={e => this.setState({username: e.target.value})}
                        />
                    </div>
                    <div>
                        <FormField
                            id="outlined-name"
                            label="Password"
                            margin="dense"
                            variant="outlined"
                            type="password"
                            onChange={e => this.setState({password: e.target.value})}
                        />
                    </div>
                    <hr/>
                    <div>
                        <Button
                            style={{marginBottom: '10px'}}
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.submit}
                        >
                            SIGN IN
                        </Button>

                        <Button fullWidth onClick={this.goToSignUp}>
                            Don't have an account? Sign up now!
                        </Button>
                        &nbsp; &nbsp;
                        <Button fullWidth onClick={this.signInAsGuest}>
                            sign in as a guest!
                        </Button>
                    </div>
                </FormContainer>
            </div>
        );
    }
}

export default SignInPage;
