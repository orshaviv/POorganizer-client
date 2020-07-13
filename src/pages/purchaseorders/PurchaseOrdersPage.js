import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Fab, IconButton} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SignOutIcon from '@material-ui/icons/ExitToApp'
import styled from 'styled-components';
import PurchaseOrder from "../../components/PurchaseOrder";
import PurchaseOrdersFilters from "../../components/PurchaseOrdersFilters";

const PurchaseOrdersWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: auto;
  padding: 20px;
  box-sizing: border-box;
`;

const PurchaseOrdersHeader = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 3px solid #757c87;
`;

const Title = styled.h1`
  width: 100%;
  color: #edf4ff;
`;

const CreateButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const PurchaseOrdersContainer = styled.div`
  padding-top: 20px;
`;

const EmptyPurchaseOrdersPlaceholder = styled.p`
  color: #edf4ff;
  text-align: center;
  font-size: 22px;
`;

const SignOutIconContainer = styled.div`
  margin-left: 10px;
  
  .signOutIcon {
    fill: #edf4ff;
  }
`;

@observer
@inject('purchaseOrdersStore', 'routerStore', 'userStore')
class PurchaseOrdersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userPreferences: null,
        };
    }

    onMount = async () => {
        await this.props.purchaseOrdersStore.fetchPurchaseOrders();
        const userPreferences = await this.props.userStore.getUserPreferences();
        this.setState({
            userPreferences,
        })
    }

    componentDidMount() {
        this.onMount();
    }

    handleSignOut = () => {
        const {userStore, purchaseOrdersStore, routerStore} = this.props;
        userStore.signout();
        purchaseOrdersStore.resetPurchaseOrders();
        routerStore.push('/signin');
    };

    renderPurchaseOrders = () => {
        const { purchaseOrdersStore } = this.props;

        if (purchaseOrdersStore.purchaseOrders === null) {
            return <EmptyPurchaseOrdersPlaceholder>
                Loading Purchase Orders..
            </EmptyPurchaseOrdersPlaceholder>
        }

        if (!purchaseOrdersStore.purchaseOrders.length) {
            return <EmptyPurchaseOrdersPlaceholder>
                No purchase orders available. Create one?
            </EmptyPurchaseOrdersPlaceholder>
        }

        return purchaseOrdersStore.purchaseOrders.map(purchaseOrder => (
            <PurchaseOrder
                key={purchaseOrder.id}
                id={purchaseOrder.id}
                poId={purchaseOrder.poId}

                supplierName={purchaseOrder.supplierName}
                contactName={purchaseOrder.contactName}

                completionDate={purchaseOrder.completionDate}
                paymentStatus={purchaseOrder.paymentStatus}
                poStatus={purchaseOrder.poStatus}
                deliveryMethod={purchaseOrder.deliveryMethod}
                paymentMethod={purchaseOrder.paymentMethod}

                quantity={purchaseOrder.quantity}
                catalogNumber={purchaseOrder.catalogNumber}
                itemCost={purchaseOrder.itemCost}
                details={purchaseOrder.details}

                totalCostBeforeTax={purchaseOrder.totalCostBeforeTax}
                taxPercentage={purchaseOrder.taxPercentage}

                userPreferences={this.state.userPreferences}
            />
        ));
    };

    render() {
        return (
            <PurchaseOrdersWrapper>
                <PurchaseOrdersHeader>
                    <Title>Purchase Orders.</Title>

                    <CreateButtonContainer>
                        <Fab
                            variant="extended"
                            onClick={() => {
                                this.props.purchaseOrdersStore.resetPurchaseOrders();
                                this.props.routerStore.push('/userpreferences/')
                            }}
                        >
                            <EditIcon/>
                            Preferences
                        </Fab>
                        &nbsp; &nbsp;
                        <Fab
                            variant="extended"
                            onClick={() => {
                                this.props.purchaseOrdersStore.resetPurchaseOrders();
                                this.props.routerStore.push('/purchaseorders/create')
                            }}
                        >
                            <AddIcon/>
                            Create
                        </Fab>

                        <SignOutIconContainer>
                            <IconButton onClick={this.handleSignOut}>
                                <SignOutIcon className="signOutIcon"/>
                            </IconButton>
                        </SignOutIconContainer>
                    </CreateButtonContainer>
                </PurchaseOrdersHeader>

                <PurchaseOrdersFilters/>

                <PurchaseOrdersContainer>
                    {this.renderPurchaseOrders()}
                </PurchaseOrdersContainer>
            </PurchaseOrdersWrapper>
        );
    }
}

export default PurchaseOrdersPage;
