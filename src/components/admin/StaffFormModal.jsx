import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';

export const StaffFormModal = ({ isOpen, onClose, staffToEdit = null }) => {
  const { addStaff, updateStaff } = useRestaurant();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Kitchen Staff',
    shift: 'Morning (09:00 AM - 05:00 PM)',
    status: 'Active'
  });

  useEffect(() => {
    if (staffToEdit) {
      setFormData({
        name: staffToEdit.name || '',
        email: staffToEdit.email || '',
        phone: staffToEdit.phone || '',
        role: staffToEdit.role || 'Kitchen Staff',
        shift: staffToEdit.shift || 'Morning (09:00 AM - 05:00 PM)',
        status: staffToEdit.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Kitchen Staff',
        shift: 'Morning (09:00 AM - 05:00 PM)',
        status: 'Active'
      });
    }
  }, [staffToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      addToast('Please fill all required fields', 'warning');
      return;
    }

    if (staffToEdit) {
      await updateStaff(staffToEdit.id, formData);
      addToast(`Staff member "${formData.name}" updated`, 'success');
    } else {
      await addStaff(formData);
      addToast(`Added staff member "${formData.name}"`, 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staffToEdit ? `Edit Staff: ${staffToEdit.name}` : 'Add New Staff Member'}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Chandra"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ramesh@grandtable.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="text"
            className="form-control"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Staff Role *</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Kitchen Staff">Kitchen Staff</option>
              <option value="Waiter">Waiter</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Working Shift</label>
          <input
            type="text"
            className="form-control"
            value={formData.shift}
            onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
            placeholder="e.g. Morning (09:00 AM - 05:00 PM)"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            {staffToEdit ? 'Save Changes' : 'Add Staff'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
