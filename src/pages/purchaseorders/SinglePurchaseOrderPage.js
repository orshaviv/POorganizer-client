import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Fab, IconButton } from '@material-ui/core';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import styled from 'styled-components';
import SinglePurchaseOrder from "../../components/SinglePurchaseOrder";
import generatePdf from '../../components/GeneratePdf';

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
class SinglePurchaseOrderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchaseOrderId: null,
            purchaseOrder: null,
            userPreferences: null,
        }
    }

    componentDidMount() {
        this.fetchPurchaseOrder().then(r => r).catch(err => err);
        this.props.userStore.getUserPreferences().then(userPreferences => {
            this.setState({
                userPreferences,
            })
        });
    }

    fetchPurchaseOrder = async () => {
        const purchaseOrderId = parseInt(this.props.match.params.id);

        const purchaseOrder = await this.props.purchaseOrdersStore.fetchPurchaseOrderById(purchaseOrderId);

        if (purchaseOrder) {
            this.setState({
                purchaseOrderId: purchaseOrder.id,
                purchaseOrder,
            });
        }else{
            this.setState({
                purchaseOrderId: -1,
                purchaseOrder: null,
            });
        }
    }

    downloadPdf = () => {
        // let {
        //     poId, supplierName, contactName,
        //     catalogNumber, quantity, details,
        //     itemCost, totalCostBeforeTax, taxPercentage,
        //     companyEmail, companyAddress
        // } = this.state.purchaseOrder;

        const purchaseOrder = this.state.purchaseOrder;

        // {
        //     poId, supplierName, contactName,
        //     catalogNumber, quantity, details,
        //     itemCost, totalCostBeforeTax, taxPercentage,
        //     companyEmail, companyAddress
        // };

        console.log(purchaseOrder);

        const userPreferences = this.state.userPreferences;

        generatePdf(purchaseOrder, userPreferences);
    }

    handleGoHome = () => {
        this.props.purchaseOrdersStore.resetPurchaseOrders();
        this.props.routerStore.push(`/purchaseorders`);
    }

    renderPurchaseOrder = () => {
        if (this.state.purchaseOrderId === null) {
            return <EmptyPurchaseOrdersPlaceholder>
                Loading Purchase Order..
            </EmptyPurchaseOrdersPlaceholder>
        }

        if (this.state.purchaseOrderId === -1) {
            return <EmptyPurchaseOrdersPlaceholder>
                Purchase order with id {this.props.match.params.id} not found.
            </EmptyPurchaseOrdersPlaceholder>
        }

        return (
            <SinglePurchaseOrder
                key={ this.state.purchaseOrder.id }
                poId={ this.state.purchaseOrder.poId }
                id={ this.state.purchaseOrder.id }
                supplierName={ this.state.purchaseOrder.supplierName }
                contactName={ this.state.purchaseOrder.contactName }
                completionDate={ this.state.purchaseOrder.completionDate }
                paymentStatus={ this.state.purchaseOrder.paymentStatus }
                poStatus={ this.state.purchaseOrder.poStatus }
                catalogNumber={ this.state.purchaseOrder.catalogNumber }
                totalCostBeforeTax={ this.state.purchaseOrder.totalCostBeforeTax }
                taxPercentage={ this.state.purchaseOrder.taxPercentage }
                paymentMethod={ this.state.purchaseOrder.paymentMethod }
                deliveryMethod={ this.state.purchaseOrder.deliveryMethod }
                quantity={ this.state.purchaseOrder.quantity }
                details={ this.state.purchaseOrder.details }
                itemCost={ this.state.purchaseOrder.itemCost }
            />
        );
    };

    render() {
        return (
            <PurchaseOrdersWrapper>
                <PurchaseOrdersHeader>
                    <Title>Purchase Order No. {this.state.purchaseOrder? this.state.purchaseOrder.poId : ''}</Title>

                    <CreateButtonContainer>
                        <SignOutIconContainer>
                            <IconButton onClick={this.handleGoHome}>
                                <HomeIcon style={{color: '#edf4ff'}} className="homeIcon" />
                            </IconButton>
                        </SignOutIconContainer>

                        <Fab
                            variant="extended"
                            onClick={ this.downloadPdf }
                        >
                            Generate pdf
                        </Fab>

                        <SignOutIconContainer>
                            <IconButton onClick={this.handleSignOut}>
                                <SignOutIcon className="signOutIcon" />
                            </IconButton>
                        </SignOutIconContainer>
                    </CreateButtonContainer>
                </PurchaseOrdersHeader>

                <PurchaseOrdersContainer>
                    { this.renderPurchaseOrder() }
                </PurchaseOrdersContainer>
            </PurchaseOrdersWrapper>
        );
    }
}

export default SinglePurchaseOrderPage;

