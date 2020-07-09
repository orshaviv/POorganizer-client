import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import {inject} from "mobx-react";

const filter = createFilterOptions();

@inject('purchaseOrdersStore')
class SuppliersAutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suppliers: [],
            currentSupplierName: '',
        }
    }

    importSuppliers = async () => {
        const { purchaseOrdersStore } = this.props;

        const res = await purchaseOrdersStore.getSuppliers();
        let suppliers = [];

        if (res) {
            suppliers = res.map(x => {
                x.supplierName = x.name;
                x.supplierId = x.id;
                return x;
            });
        }

        this.setState({
            suppliers,
        });
    }

    componentDidMount() {
        this.importSuppliers().then(r => r).catch(err => console.log(err));
    }

    render() {
        const { setSupplier } = this.props;
        const { suppliers, currentSupplierName } = this.state;

        return (
            <Autocomplete
                value={currentSupplierName}
                onChange={(event, newValue) => {
                    if (newValue && newValue.id) {
                        const chosenSupplier = suppliers.find(supplier => supplier.id === newValue.id);
                        this.setState({
                            currentSupplierName: chosenSupplier.supplierName,
                        });
                        setSupplier(chosenSupplier.supplierName, chosenSupplier.id);
                    } else if (newValue) {
                        const supplierName = newValue.inputValue;
                        this.setState({
                            currentSupplierName: supplierName,
                        });
                        setSupplier(supplierName, null);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    // Suggest the creation of a new value
                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            supplierName: `Add "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="supplierName"
                options={suppliers}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    // Regular option
                    return option.supplierName;
                }}
                renderOption={(option) => option.supplierName}
                //style={{ width: 300 }}
                fullWidth
                margin="normal"
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Supplier Name" variant="outlined" />
                )}
            />
        );
    }
}

export default SuppliersAutoComplete;
