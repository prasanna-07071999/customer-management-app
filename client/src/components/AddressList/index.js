import {Component} from 'react';
import AddressForm from '../AddressForm';
import axios from 'axios';
import './index.css';

class AddressList extends Component {
  state = {
    showForm: false,
    addressToEdit: null,
  };

  refreshAddresses = async () => {
    const { customerId, setAddresses } = this.props;
    try {
      const response = await axios.get(`http://localhost:5000/api/customers/${customerId}/addresses`);
      let data = response.data;

      const normalized = data.addressesArray.map(addr => ({
      id: addr.id,
      addressDetails: addr.address_details,
      city: addr.city,
      state: addr.state,
      pinCode: addr.pin_code,
    }));

      setAddresses(normalized);

    } catch (error) {
      alert('Failed to refresh addresses');
      console.log('Refresh addresses error:', error);
    }
  };

  updatedAddresses = async (deletedAddressId) => {
    const {setAddresses} = this.props
    const updatedAddresses = this.props.addresses.filter(address => address.id !== deletedAddressId);
    setAddresses(updatedAddresses);
};

handleDeleteClick = async (addressId) => {
    try {
      await axios.delete(`http://localhost:5000/api/addresses/${addressId}`);
      await this.updatedAddresses(addressId);
    } catch (error) {
      alert('Failed to delete address');
      console.log('Delete address error:', error);
    }
};

  handleAddClick = address => {
    this.setState({ addressToEdit: address, showForm: true });
  };

  handleEditClick = (addr) => {
    this.setState({ addressToEdit: addr, showForm: true });
  };

  handleFormClose = () => {
    this.setState({ showForm: false, addressToEdit: null });
  };

  render() {
    const { addresses } = this.props;
    console.log(typeof(addresses))
    const { showForm, addressToEdit } = this.state;
    return (
      <div className="address-list">
        <div className='heading-button'>
          <h1 className='addresses-heading'>Addresses</h1>
          <button className="add-address-btn" onClick={this.handleAddClick}>Add Address</button>
        </div>
        
        {showForm && (
          <AddressForm
            customerId={this.props.customerId}
            address={addressToEdit}
            onClose={this.handleFormClose}
            refreshAddresses={this.refreshAddresses}
          />
        )}
        {addresses.length === 0 ? (
          <p>No addresses available.</p>
        ) : (
          <ul className='addresses-list'>
            {addresses.map(address => (
              <li key={address.id} className='addresses-list-items'>
                {address.addressDetails}, {address.city},   {address.state},  {address.pinCode}
                <button className="edit-address-button" onClick={() => this.handleEditClick(address)}>Edit</button>
                <button className="delete-address-button" onClick={() => this.handleDeleteClick(address.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default AddressList
