import React, { Component } from 'react';
import { TextField, FormControl, Button } from '@material-ui/core';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import ErrorMessage from '../../components/ErrorMessage';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add"
import InputAdornment from "@material-ui/core/InputAdornment";
import SuppliersAutoComplete from "./SuppliersAutoComplete";
import ContactsAutoComplete from "./ContactsAutoComplete"

const FormWrapper = styled.div`
  width: 100vw;
  
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  background-color: #edf4ff;
  padding: 30px;
  border-radius: 5px;
`;

const deliveryMethods = ['Delivery', 'Pickup'];
const paymentMethods = ['Credit', 'Due 30', 'Due 60', 'Cash'];

@inject('purchaseOrdersStore', 'routerStore')
class CreatePurchaseOrderPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deliveryMethod: '',
      paymentMethod: '',
      completionDate: '',

      supplierName: '',
      contactName: '',

      supplierId: '',
      contactId: '',
      taxPercentage: '17',

      catalogNumbers: [],
      quantities: [],
      itemsCost: [],
      details: [],

      errorMessage: null,

      directors_array: ["director-0"]
    };
  }

  appendInput_director() {
    this.setState({
      catalogNumbers: [...this.state.catalogNumbers, ""],
      quantities: [...this.state.quantities, 0],
      itemsCost: [...this.state.itemsCost, 0],
      details: [...this.state.details, ""],
    })

    const newInput = `director-${this.state.directors_array.length}`;
    console.log(this.state.directors_array.concat([newInput]));
    this.setState(prevState => ({
      directors_array: prevState.directors_array.concat([newInput])
    }));
  }

  handleChangeItems(e, index) {
    if (e.target.name === 'cat') {
      this.state.catalogNumbers[index] = e.target.value;
      this.setState({catalogNumbers: this.state.catalogNumbers});
    }
    else if(e.target.name === 'quantity') {
      this.state.quantities[index] = e.target.value;
      this.setState({quantities: this.state.quantities});
    }
    else if(e.target.name === 'cost') {
      this.state.itemsCost[index] = e.target.value;
      this.setState({itemsCost: this.state.itemsCost});
    }
    else if(e.target.name === 'details') {
      this.state.details[index] = e.target.value;
      this.setState({details: this.state.details});
    }
  }

  handleSubmitTask = async () => {
    const { purchaseOrdersStore, routerStore } = this.props;
    const {
      deliveryMethod, paymentMethod, completionDate,
      supplierName, contactName,
      supplierId, contactId, taxPercentage,
      catalogNumbers, quantities, itemsCost, details } = this.state;

    try {
      let purchaseOrderDto = {
        deliveryMethod,
        paymentMethod,
        completionDate,
        supplierName,
        contactName,

        supplierId,
        contactId,
        taxPercentage,

        catalogNumbers,
        quantities,
        itemsCost,
        details
      };

      console.log(`values: ${JSON.stringify(purchaseOrderDto)}`);
      const result = await purchaseOrdersStore.createPurchaseOrder(purchaseOrderDto);

      if (result){
        routerStore.push(`/purchaseorders/id/${result.id}`);
      }else{
        routerStore.push(`/purchaseorders/id/${this.props.purchaseOrdersStore.purchaseOrders[0].id}`);
      }

    } catch (error) {
      try{
        const errorMessage = error.response.data.message;
        this.setState({ errorMessage });
      }catch{
        this.setState({ errorMessage: error });
      }
    }
  };

  render() {
    return (
      <FormWrapper>
        <FormContainer>
          <h1>Create Purchase Order.</h1>

          { this.state.errorMessage && <ErrorMessage message={this.state.errorMessage} />}

          <Autocomplete
            id='deliveryMethod'
            freeSolo
            options={deliveryMethods.map((option) => option)}
            onChange={(e, v) => this.setState({ deliveryMethod: v })}
            renderInput={(params) => (
              <TextField {...params}
                label='Delivery Method'
                margin="normal"
                variant="outlined"
                fullWidth
              />
            )}
          />

          <Autocomplete
              id='paymentMethod'
              freeSolo
              options={paymentMethods.map((option) => option)}
              onChange={(e, v) => this.setState({ paymentMethod: v })}
              renderInput={(params) => (
                  <TextField {...params}
                             label='Payment Method'
                             margin="normal"
                             variant="outlined"
                             fullWidth
                  />
              )}
          />

          <FormControl fullWidth>
            <TextField
                id="completionDate"
                label="Completion Date"
                type="date"
                onChange={e => this.setState({completionDate: e.target.value})}
                defaultValue={`${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,'0')}-${new Date().getDate().toString().padStart(2,'0')}`}
                InputLabelProps={{
                  shrink: true,
                }}
            />
          </FormControl>
          &nbsp;
          <SuppliersAutoComplete
            setSupplier={(supplierName, supplierId) => {
              this.setState({
                supplierName,
                supplierId,
              })
            }}
          />
          &nbsp;
          <ContactsAutoComplete
              setContact={(contactName, contactId) => {
                this.setState({
                  contactName: contactName,
                  contactId,
                })
              }}
              supplierId={ this.state.supplierId }
          />

          <FormControl>
            <TextField
                label="Tax Percentage (%)"
                placeholder="taxPercentage"
                margin="normal"
                variant="outlined"
                onChange={e => this.setState({ taxPercentage: e.target.value })}
                defaultValue={17}
            />
          </FormControl>

          <h3>Items:</h3>
          <div>
            {this.state.directors_array.map((input, index) => (
                <Grid container spacing={3} item>
                  <Grid item xs={12} sm={4}>
                    <FormControl>
                      <TextField
                          variant="outlined"
                          required
                          id={input + "-cat"}
                          label="CAT No."
                          name={"cat"}
                          size="small"
                          fullWidth
                          onChange={(e) => this.handleChangeItems(e, index)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl>
                      <TextField
                          variant="outlined"
                          required
                          type="number"
                          id={input + "-quantity"}
                          label="Quantity"
                          name={"quantity"}
                          size="small"
                          fullWidth
                          onChange={(e) => this.handleChangeItems(e, index)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl>
                      <TextField
                          variant="outlined"
                          required
                          type="float"
                          id={input + "-cost"}
                          label="Cost"
                          name={"cost"}
                          size="small"
                          fullWidth
                          onChange={(e) => this.handleChangeItems(e, index)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                      <FormControl fullWidth>
                        <TextField
                            margin="normal"
                            variant="outlined"
                            id={input + "-details"}
                            label="Item details"
                            name={"details"}
                            size="small"
                            onChange={(e) => this.handleChangeItems(e, index)}
                            InputProps={{
                              endAdornment: index + 1 ===
                                  this.state.directors_array.length && (
                                      <InputAdornment position="start">
                                        <Tooltip title="Add Item">
                                          <Fab
                                              color="primary"
                                              size="small"
                                              onClick={() => this.appendInput_director()}
                                          >
                                            <AddIcon />
                                          </Fab>
                                        </Tooltip>
                                      </InputAdornment>
                                  )
                            }}
                        />
                      </FormControl>
                  </Grid>
                </Grid>
            ))}
          </div>

          <Button
            style={{ marginTop: '10px' }}
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.handleSubmitTask}
          >
            CREATE PURCHASE ORDER
          </Button>
        </FormContainer>
      </FormWrapper>
    );
  }
}

export default CreatePurchaseOrderPage;
