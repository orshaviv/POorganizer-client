import React, { Component } from 'react';
import { Grid, FormControl, Select, MenuItem, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const FiltersContainer = styled.div`
  margin-top: 20px;
`;

const ControlContainer = styled.div`
  background-color: #c0cde0;
  border-radius: 5px;
  padding: 10px;
`;

@inject('purchaseOrdersStore')
class PurchaseOrdersFilters extends Component {
  filters$ = new Subject();

  constructor(props) {
    super(props);

    this.state = {
      poStatus: '',
      search: '',
    };

    this.filters$
      .pipe(
        debounceTime(500),
      )
      .subscribe(filters => {
        props.purchaseOrdersStore.updateFilters(filters);
      });
  }

  syncFilters = () => {
    const { poStatus, search } = this.state;
    this.filters$.next({ poStatus, search });
  }

  handleStatusFilterChange = e => {
    const poStatus = e.target.value;
    this.setState({ poStatus }, this.syncFilters);
  };

  handleSearchTermChange = e => {
    const search = e.target.value;
    this.setState({ search }, this.syncFilters);
  }

  render() {
    return (
      <FiltersContainer>
        <Grid
          justify="space-between" // Add it here :)
          container
        >
          <Grid purchaseOrder>
            <ControlContainer>
              <FormControl style={{ width: '220px' }}>
                <TextField
                  placeholder="Search..."
                  value={this.state.search}
                  onChange={this.handleSearchTermChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </ControlContainer>
          </Grid>

          <Grid purchaseOrder>
            <ControlContainer>
              <FormControl style={{ width: '220px' }}>
                <Select
                  value={this.state.poStatus}
                  onChange={this.handleStatusFilterChange}
                  displayEmpty
                >
                  <MenuItem value=''>No status filter</MenuItem>
                  <MenuItem value={'OPEN'}>Open</MenuItem>
                  <MenuItem value={'SENT'}>Sent</MenuItem>
                  <MenuItem value={'CANCELED'}>Canceled</MenuItem>
                </Select>
              </FormControl>
            </ControlContainer>
          </Grid>
        </Grid>
      </FiltersContainer>
    );
  }
}

export default PurchaseOrdersFilters;
