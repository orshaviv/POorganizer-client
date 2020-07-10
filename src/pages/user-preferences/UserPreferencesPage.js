import React, { Component } from 'react';
import {Button, Fab, TextField} from '@material-ui/core';
import styled from 'styled-components';
import './UserPreferencesPage.scss';
import { inject } from 'mobx-react';
import ErrorMessage from '../../components/ErrorMessage';
import NavigationIcon from '@material-ui/icons/Navigation';

const Heading = styled.h1`
  margin-top: 3;
`;

const PurchaseOrdersHeader = styled.div`
  display: flex;
  justify-content: left;
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

const CreateButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: right;
`;


@inject('userStore', 'routerStore')
class UpdateUserPreferences extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: null,
            companyCode: null,
            companyAddress: null,
            companyEmail: null,
            companyWebsite: null,

            headerLogo: null,
            footerLogo: null,
            errorMessage: null,

            successfulUpdated: false,
        };
    }

    submit = async () => {
        const { companyName, companyCode, companyAddress, companyEmail, companyWebsite, headerLogo, footerLogo } = this.state;

        const formData = new FormData();
        formData.append('companyName', companyName);
        formData.append('companyCode', companyCode);
        formData.append('companyAddress', companyAddress);
        formData.append('companyEmail', companyEmail);
        formData.append('companyWebsite', companyWebsite);
        formData.append('headerLogo', headerLogo);
        formData.append('footerLogo', footerLogo);

        try {
            await this.props.userStore.updateUserPreferences(formData);
            this.setState({ successfulUpdated: true });
            //this.props.routerStore.push('/purchaseorders');
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message;
                this.setState({errorMessage});
            }else{
                console.log(error);
            }
        }
    };

    getUserPreferences = async () => {
        const userPreferences = await this.props.userStore.getUserPreferences();

        const { companyName, companyCode, companyAddress,
            companyEmail, companyWebsite } = userPreferences;

        if (userPreferences) {
            this.setState( {
                companyName,
                companyCode,
                companyAddress,
                companyEmail,
                companyWebsite
            });
        }
    }

    componentDidMount() {
        this.getUserPreferences();
    }

    render() {
        const { errorMessage } = this.state;

        return (
            <div className="fullscreen-wrapper">
                <FormContainer>
                    <CreateButtonContainer>
                        <Fab
                            variant="extended"
                            size={"small"}
                            onClick={() => {
                                this.props.routerStore.push('/purchaseorders');
                            }}
                        >
                            <NavigationIcon />
                            Purchase Orders
                        </Fab>
                    </CreateButtonContainer>
                    <PurchaseOrdersHeader>
                            <Heading>User Preferences.</Heading>
                    </PurchaseOrdersHeader>

                    { this.state.successfulUpdated && <h5>Preferences successfully updated.</h5> }
                    { errorMessage && <ErrorMessage message={this.state.errorMessage} /> }

                    <div>
                        <FormField
                            id="outlined-name"
                            label="Company Name"
                            margin="dense"
                            variant="outlined"
                            value={this.state.companyName}
                            focused={this.state.companyName? true : false}
                            onChange={e => this.setState({ companyName: e.target.value })}
                        />
                    </div>
                    <div>
                        <FormField
                            id="outlined-name"
                            label="Company Code"
                            margin="dense"
                            variant="outlined"
                            value={this.state.companyCode}
                            focused={this.state.companyCode? true : false}
                            onChange={e => this.setState({ companyCode: e.target.value })}
                        />
                    </div>
                    <div>
                        <FormField
                            id="outlined-name"
                            label="Company Address"
                            margin="dense"
                            variant="outlined"
                            value={this.state.companyAddress}
                            focused={this.state.companyAddress? true : false}
                            onChange={e => this.setState({ companyAddress: e.target.value })}
                        />
                    </div>
                    <div>
                        <FormField
                            id="outlined-name"
                            label="Company Email"
                            margin="dense"
                            variant="outlined"
                            type="email"
                            value={this.state.companyEmail}
                            focused={this.state.companyEmail? true : false}
                            onChange={e => this.setState({ companyEmail: e.target.value })}
                        />
                    </div>
                    <div>
                        <FormField
                            id="outlined-name"
                            label="Company Website"
                            margin="dense"
                            variant="outlined"
                            value={this.state.companyWebsite}
                            focused={this.state.companyWebsite? true : false}
                            onChange={e => this.setState({ companyWebsite: e.target.value })}
                        />
                    </div>
                    &nbsp;
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
                            UPDATE
                        </Button>
                    </div>
                </FormContainer>
            </div>
        );
    }
}

export default UpdateUserPreferences;
