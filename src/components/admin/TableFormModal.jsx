import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';

export const TableFormModal = ({ isOpen, onClose, tableToEdit = null }) => {
  const { addTable, updateTable } = useRestaurant();
  const { addToast } = useToast();

  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [status, setStatus] = useState('Available');
  const [location, setLocation] = useState('Main Dining');

  useEffect(() => {
    if (tableToEdit) {
      setNumber(tableToEdit.number);
      setCapacity(tableToEdit.capacity);
      setStatus(tableToEdit.status);
      setLocation(tableToEdit.location || 'Main Dining');
    } else {
      setNumber('');
      setCapacity(4);
      setStatus('Available');
      setLocation('Main Dining');
    }
  }, [tableToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!number) {
      addToast('Please enter table number', 'warning');
      return;
    }

    if (tableToEdit) {
      await updateTable(tableToEdit.id, { number, capacity: Number(capacity), status, location });
      addToast(`Table ${number} updated`, 'success');
    } else {
      await addTable({ number, capacity: Number(capacity), status, location });
      addToast(`Table ${number} added`, 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tableToEdit ? `Edit Table ${tableToEdit.number}` : 'Add New Restaurant Table'}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Table Number *</label>
          <input
            type="text"
            className="form-control"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g. 15 or T-15"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Seating Capacity *</label>
          <select
            className="form-select"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          >
            <option value={2}>2 Persons (Couple)</option>
            <option value={4}>4 Persons (Standard)</option>
            <option value={6}>6 Persons (Family)</option>
            <option value={8}>8 Persons (Large Group/VIP)</option>
            <option value={10}>10+ Persons</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Location / Section</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Window Bay, Courtyard, Terrace"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Occupied">Occupied</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            {tableToEdit ? 'Save Changes' : 'Add Table'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
