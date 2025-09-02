import React from 'react';
import axios from 'axios';
import './index.css';

class AddressForm extends React.Component {
  state = {
    addressDetails: '',
    city: '',
    state: '',
    pinCode: '',
    errors: {},
  };

  componentDidMount() {
      const address = this.props.address || {}
      const { addressDetails = '', city = '', state = '', pinCode='' } = address;
      this.setState({ addressDetails, city, state, pinCode });
    
  }

  validate = () => {
    const errors = {};
    const { addressDetails, city, state, pinCode } = this.state;

    if (!addressDetails || addressDetails.trim() === '') {
      errors.addressDetails = 'Address details are required';
    }
    if (!city || city.trim() === '') {
      errors.city = 'City is required';
    }
    if (!state || state.trim() === '') {
      errors.state = 'State is required';
    }
    if (!pinCode || pinCode.trim() === '') {
      errors.pinCode = 'Pin code is required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleAddressDetails = (event) => {
    this.setState({ addressDetails: event.target.value });
  };

  handleCity = (event) => {
    this.setState({ city: event.target.value });
  };

  handleState = (event) => {
    this.setState({ state: event.target.value });
  };

  handlePinCode = (event) => {
    this.setState({ pinCode: event.target.value });
  };

  handleSubmit = async (event) => {
  event.preventDefault();

  if (!this.validate()) {
    return;
  }

  const { addressDetails, city, state, pinCode } = this.state;
  const data = {
    address_details: addressDetails,
    city,
    state,
    pin_code: pinCode,
  };
  const { address, customerId, refreshAddresses, onClose } = this.props;
  try {
    let response;
    if (address && address.id) {
      response = await axios.put(
        `https://customer-management-backend-73do.onrender.com/api/addresses/${address.id}`,
        data
      );
    } else {
      response = await axios.post(
        `https://customer-management-backend-73do.onrender.com/api/customers/${customerId}/addresses`,
        data
      );
    }
    
    await refreshAddresses(response.data);
    onClose();
  } catch (error) {
    alert('Failed to save address');
    console.log('AddressForm save error:', error);
  }
};

  render() {
    const { addressDetails, city, state, pinCode, errors } = this.state;
    const { address } = this.props;
    return (
      <form className="address-form" onSubmit={this.handleSubmit}>
        <label className='label-text'> Address Details: </label>
        <input
          name="addressDetails"
          value={addressDetails}
          onChange={this.handleAddressDetails}
          className={errors.addressDetails ? 'error-text' : 'input-field'}
        />
        {errors.addressDetails && <div className="error">{errors.addressDetails}</div>}
        <label className='label-text'> City: </label>
        <input
          name="city"
          value={city}
          onChange={this.handleCity}
          className={errors.city ? 'error-text' : 'input-field'}
        />
        {errors.city && <div className="error">{errors.city}</div>}
        <label className='label-text'>State:</label>
        <input
          name="state"
          value={state}
          onChange={this.handleState}
          className={errors.state ? 'error-text' : 'input-field'}
        />
        {errors.state && <div className="error">{errors.state}</div>}
        <label className='label-text'> Pin Code: </label>
        <input
          name="pinCode"
          value={pinCode}
          onChange={this.handlePinCode}
          className={errors.pinCode ? 'error-text' : 'input-field'}
        />
        {errors.pinCode && <div className="error">{errors.pinCode}</div>}
        <div className="buttons">
          {address && address.id ? (
            <button type='submit' className='update-button'>Update Address</button>
            ): 
            (<button type="submit" className='add-button'>Add Address</button>)
          }
          <button type="button" className="cancel-button"onClick={this.props.onClose}>Cancel</button>
        </div>
      </form>
    )
  }
}

export default AddressForm;
