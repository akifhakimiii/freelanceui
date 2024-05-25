// AddUserForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    skillsets: '',
    hobby: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits';
    }
    if (!formData.skillsets.trim()) {
      newErrors.skillsets = 'Skillsets is required';
    }
    if (!formData.hobby.trim()) {
      newErrors.hobby = 'Hobby is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios.post('http://localhost:5192/api/User', formData)
        .then(response => {
          console.log('User added:', response.data);
          // Reset form fields or show success message
          setFormData({
            username: '',
            email: '',
            phoneNumber: '',
            skillsets: '',
            hobby: ''
          });
        })
        .catch(error => {
          console.error('Error adding user:', error);
          if (error.response && error.response.data) {
            const errorMessage = error.response.data;
            // Update state to display the error message
            setServerError(errorMessage);
          } else {
            // Handle generic error
            setServerError('An error occurred while adding the user.');
          }
        });
    }
  };

  return (
    <div>
      {serverError && <Typography color="error">{serverError}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          name="phoneNumber"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />
        <TextField
          name="skillsets"
          label="Skillsets"
          value={formData.skillsets}
          onChange={handleChange}
          error={!!errors.skillsets}
          helperText={errors.skillsets}
        />
        <TextField
          name="hobby"
          label="Hobby"
          value={formData.hobby}
          onChange={handleChange}
          error={!!errors.hobby}
          helperText={errors.hobby}
        />
        <Button type="submit" variant="contained" color="primary">Add User</Button>
      </form>
    </div>
  );
};

export default AddUserForm;
