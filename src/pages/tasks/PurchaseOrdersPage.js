import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Fab, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SignOutIcon from '@material-ui/icons/ExitToApp'
import styled from 'styled-components';
import PurchaseOrder from "../../components/PurchaseOrder";
import PurchaseOrdersFilters from "../../components/PurchaseOrdersFilters";


const PurchaseOrdersWrapper = styled.div`
  width: 100%;
  max-width: 860px;
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

@inject('purchaseOrdersStore', 'routerStore', 'userStore')
@observer
class PurchaseOrdersPage extends Component {
  componentDidMount() {
    this.props.purchaseOrdersStore.fetchPurchaseOrders();
  }
  
  handleSignOut = () => {
    const { userStore, purchaseOrdersStore, routerStore } = this.props;
    userStore.signout();
    purchaseOrdersStore.resetPurchaseOrders();
    routerStore.push('/signin');
  };

  renderPurchaseOrders = () => {
    const { purchaseOrdersStore } = this.props;

    if (!purchaseOrdersStore.purchaseOrders.length) {
      return <EmptyPurchaseOrdersPlaceholder>
              No purchase orders available. Create one?
            </EmptyPurchaseOrdersPlaceholder>
    }

    return purchaseOrdersStore.purchaseOrders.map(purchaseOrder => (
      <PurchaseOrder
        poId={ purchaseOrder.poId }
        id={ purchaseOrder.id }
        supplierName={ purchaseOrder.supplierName }
        contactName={ purchaseOrder.contactName }
        completionDate={ purchaseOrder.completionDate }
        paymentStatus={ purchaseOrder.paymentStatus }
        poStatus={ purchaseOrder.poStatus }
        catalogNumber={ purchaseOrder.catalogNumber }
        totalCostBeforeTax={ purchaseOrder.totalCostBeforeTax }
        taxPercentage={ purchaseOrder.taxPercentage }
        paymentMethod={ purchaseOrder.paymentMethod }
        deliveryMethod={ purchaseOrder.deliveryMethod }
        quantity={ purchaseOrder.quantity }
        details={ purchaseOrder.details }
        itemCost={ purchaseOrder.itemCost }
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
              onClick={() => this.props.routerStore.push('/purchaseorders/create')}
            >
              <AddIcon />
              Create Purchase Order
            </Fab>

            <SignOutIconContainer>
              <IconButton onClick={this.handleSignOut}>
                <SignOutIcon className="signOutIcon" />
              </IconButton>
            </SignOutIconContainer>
          </CreateButtonContainer>
        </PurchaseOrdersHeader>

        <PurchaseOrdersFilters />

        <PurchaseOrdersContainer>
          { this.renderPurchaseOrders() }
        </PurchaseOrdersContainer>
      </PurchaseOrdersWrapper>
    );
  }
}

export default PurchaseOrdersPage;
