import React, { Component } from 'react';
import {
    Card,
    CardContent,
    CardActions,
    MenuItem,
    Select,
    FormControl,
    Grid
} from '@material-ui/core';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import SpanningTable from "./ItemsTable";

const CardContainer = styled.div`
  margin-bottom: 20px;
`;

const CardTitle = styled.h1`
  margin: 8px 0;
  font-size: 22px;
`;

const CardSubtitle = styled.div`
  margin: 8px 0;
  font-size: 18px;
  color: #808080;
`;

@inject('purchaseOrdersStore')
class SinglePurchaseOrder extends Component {
    handleStatusChange = e => {
        this.props.purchaseOrdersStore.updatePaymentStatus(this.props.id, e.target.value).then(r => r)
            .catch(err => console.log(err));
    };

    handlePoStatusChange = e => {
        this.props.purchaseOrdersStore.updatePoStatus(this.props.id, e.target.value).then(r => r)
            .catch(err => console.log(err));
    };

    render() {
        const {
            supplierName, contactName,
            completionDate, paymentMethod, quantity, catalogNumber, details,
            itemCost, totalCostBeforeTax, taxPercentage
        } = this.props;

        return (
            <CardContainer>
                <Card>
                    <CardContent>
                        <CardTitle>
                            Purchase Order Details
                        </CardTitle>

                        <CardSubtitle>{ supplierName }, { contactName }</CardSubtitle>
                        Completion Date: { new Date(completionDate).toDateString() } | { catalogNumber.length } Items
                        | Total Cost: { (totalCostBeforeTax * (1 + taxPercentage / 100)).toFixed(1) } NIS |
                        Payment: { paymentMethod }
                    </CardContent>
                    <CardActions style={{ padding: '14px' }} disableSpacing>
                        <Grid
                            justify="space-between" // Add it here :)
                            container
                        >
                            <Grid>
                                <FormControl style={{ width: '140px' }}>
                                    <Select
                                        value={ this.props.paymentStatus }
                                        onChange={ this.handleStatusChange }
                                        displayEmpty
                                    >
                                        <MenuItem value={'PAID'}>Paid</MenuItem>
                                        <MenuItem value={'REFUND'}>Refund</MenuItem>
                                        <MenuItem value={'PENDING'}>Pending</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid>
                                Status: &nbsp;
                                <FormControl style={{ width: '140px' }}>
                                    <Select
                                        value={ this.props.poStatus }
                                        onChange={ this.handlePoStatusChange }
                                        displayEmpty
                                    >
                                        <MenuItem value={'OPEN'}>Open</MenuItem>
                                        <MenuItem value={'SENT'}>Sent</MenuItem>
                                        <MenuItem value={'CANCELED'}>Canceled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardActions>
                        { SpanningTable({
                            quantity, catalogNumber, details,
                            itemCost, totalCostBeforeTax, taxPercentage
                        }) }
                </Card>
            </CardContainer>
        );
    }
}

export default SinglePurchaseOrder;
