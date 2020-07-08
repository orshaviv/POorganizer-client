import {TextField} from "@material-ui/core";
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";
import React from "react";
import {inject} from "mobx-react";

const filter = createFilterOptions();

@inject('purchaseOrdersStore')
class ContactsAutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            currentContactName: '',
            currentSupplierId: -1,
        }
    }

    importContactsBySupplierId = async () => {
        if (this.props.supplierId != null && this.state.currentSupplierId !== this.props.supplierId) {
            const { purchaseOrdersStore, setContact } = this.props;

            await purchaseOrdersStore.getContactsBySupplierId(this.props.supplierId);
            const res = await purchaseOrdersStore.contacts;

            const contacts = res.data.map(x => {
                x.contactName = x.name;
                x.contactId = x.id;
                return x;
            });

            if (contacts.length === 1) {
                const defaultContact = contacts[0];
                this.setState({
                    contacts,
                    currentContactName: defaultContact.contactName,
                    currentSupplierId: this.props.supplierId,
                });
                setContact(defaultContact.contactName, defaultContact.id);
            }else{
                this.setState({
                    contacts,
                    currentContactName: '',
                    currentSupplierId: this.props.supplierId,
                });
            }
        }
    }

    componentDidMount() {
        this.importContactsBySupplierId();
    }

    render() {
        this.importContactsBySupplierId();

        const {setContact} = this.props;
        const {contacts, currentContactName} = this.state;

        return (
            <Autocomplete
                value={currentContactName}
                onChange={(event, newValue) => {
                    if (newValue && newValue.id) {
                        const chosenContact = contacts.find(contact => contact.id === newValue.id);
                        this.setState({
                            currentContactName: chosenContact.contactName,
                        });
                        setContact(chosenContact.contactName, chosenContact.id);
                    } else if (newValue) {
                        const contactName = newValue.inputValue;
                        this.setState({
                            currentContactName: contactName,
                        });
                        setContact(contactName, null);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    // Suggest the creation of a new value
                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            contactName: `Add "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="contactName"
                options={contacts}
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
                    return option.contactName;
                }}
                renderOption={(option) => option.contactName}
                fullWidth
                margin="normal"
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Contact Name" variant="outlined"/>
                )}
            />
        )
    };
}

export default ContactsAutoComplete;
