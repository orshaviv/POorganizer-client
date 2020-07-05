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
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Accordion from "@material-ui/core/Accordion";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SpanningTable from "../pages/tasks/ItemsTable";

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
class PurchaseOrder extends Component {
  deletePurchaseOrder = () => {
    this.props.purchaseOrdersStore.deletePurchaseOrder(this.props.id);
  };

  generatePdf = () => {
    return this.props.purchaseOrdersStore.generatePdf(this.props.id).then(res => {
      console.log(JSON.stringify(res));
    });
  };

  handleStatusChange = e => {
    this.props.purchaseOrdersStore.updatePaymentStatus(this.props.id, e.target.value);
  };

  handlePoStatusChange = e => {
    this.props.purchaseOrdersStore.updatePoStatus(this.props.id, e.target.value);
  };

  render() {
    const {
      poId, supplierName, contactName,
      completionDate, paymentMethod, quantity, catalogNumber, details,
        itemCost, totalCostBeforeTax, taxPercentage
    } = this.props;

    return (
      <CardContainer>
        <Card>
          <CardContent>
            <CardTitle>
              Purchase Order No. { poId }

              <Button size="small" color="primary" onClick={this.generatePdf}>
                Download Pdf
              </Button>
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
              <Grid purchaseOrder>
                <FormControl style={{ width: '140px' }}>
                  <Select
                    value={this.props.paymentStatus}
                    onChange={this.handleStatusChange}
                    displayEmpty
                  >
                    <MenuItem value={'PAID'}>Paid</MenuItem>
                    <MenuItem value={'REFUND'}>Refund</MenuItem>
                    <MenuItem value={'PENDING'}>Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid purchaseOrder>
                Status: &nbsp;
                <FormControl style={{ width: '140px' }}>
                  <Select
                    value={this.props.poStatus}
                    onChange={this.handlePoStatusChange}
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
          <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="items-content"
                id="items-header"
            >
              <Typography>Items</Typography>
            </AccordionSummary>
            <AccordionDetails>
              { SpanningTable({
                quantity, catalogNumber, details,
                itemCost, totalCostBeforeTax, taxPercentage
              }) }
            </AccordionDetails>
          </Accordion>
        </Card>
      </CardContainer>
    );
  }
}

export default PurchaseOrder;
