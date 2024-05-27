import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AddUserForm from './AddUserForm'; // Import AddUserForm component

const apiUrl = process.env.REACT_APP_BE_URL;
console.log(`API URL: ${apiUrl}`);
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    pageNumber: 1,
    pageSize: 5,
  });
  const [editUser, setEditUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = () => {
    axios.get(`${apiUrl}/api/User`, { params: filters })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        console.log(process.env.REACT_APP_BE_URL);
      });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setOpenEdit(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = () => {
    axios.delete(`${apiUrl}/api/User/${deleteUserId}`)
      .then(() => {
        fetchUsers();
        handleCloseDelete();
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditUser(null);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteUserId(null);
  };

  const handleEditSubmit = () => {
    console.log('Submitting edit for user:', editUser);
    axios.put(`${apiUrl}/api/User/${editUser.id}`, editUser)
      .then(response => {
        console.log('User updated successfully:', response.data);
        fetchUsers();
        handleCloseEdit();
      })
      .catch(error => {
        console.error('Error updating user:', error.response ? error.response.data : error);
      });
  };

  const handleEditChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextPage = () => {
    setFilters({
      ...filters,
      pageNumber: filters.pageNumber + 1,
    });
  };

  const handlePreviousPage = () => {
    if (filters.pageNumber > 1) {
      setFilters({
        ...filters,
        pageNumber: filters.pageNumber - 1,
      });
    }
  };

  const handlePageSizeChange = (e) => {
    setFilters({
      ...filters,
      pageSize: e.target.value,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Username"
          name="username"
          value={filters.username}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={filters.phoneNumber}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Email"
          name="email"
          value={filters.email}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Page Size"
          type="number"
          value={filters.pageSize}
          onChange={handlePageSizeChange}
          style={{ marginRight: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => setShowAddUserForm(true)} 
        >
          Add User
        </Button>
      </div>
      {showAddUserForm && <AddUserForm />} {/* Render AddUserForm component if showAddUserForm is true */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Skillsets</TableCell>
              <TableCell>Hobby</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.skillsets}</TableCell>
                <TableCell>{user.hobby}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginRight: '10px' }}
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteClick(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editUser && (
        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit the user, please update the fields below and click Save.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="username"
              label="Username"
              fullWidth
              value={editUser.username}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={editUser.email}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              name="phoneNumber"
              label="Phone Number"
              fullWidth
              value={editUser.phoneNumber}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              name="skillsets"
              label="Skillsets"
              fullWidth
              value={editUser.skillsets}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              name="hobby"
              label="Hobby"
              fullWidth
              value={editUser.hobby}
              onChange={handleEditChange}
            />
          </DialogContent>
          <DialogActions>
<Button onClick={handleCloseEdit} color="primary">
Cancel
</Button>
<Button onClick={handleEditSubmit} color="primary">
Save
</Button>
</DialogActions>
</Dialog>
)}
<Dialog
     open={openDelete}
     onClose={handleCloseDelete}
   >
<DialogTitle>Confirm Delete</DialogTitle>
<DialogContent>
<DialogContentText>
Are you sure you want to delete this user?
</DialogContentText>
</DialogContent>
<DialogActions>
<Button onClick={handleCloseDelete} color="primary">
Cancel
</Button>
<Button onClick={handleDeleteConfirm} color="primary">
Confirm
</Button>
</DialogActions>
</Dialog>
<Button onClick={handlePreviousPage} disabled={filters.pageNumber === 1}>Previous Page</Button>
<Button onClick={handleNextPage}>Next Page</Button>
</div>
);
};

export default UserList;
