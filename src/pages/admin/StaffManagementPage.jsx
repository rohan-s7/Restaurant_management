import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { StaffFormModal } from '../../components/admin/StaffFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Plus, Edit, Trash2, UserCheck, Shield, ChefHat } from 'lucide-react';

export const StaffManagementPage = () => {
  const { staffList, deleteStaff, toggleStaffStatus } = useRestaurant();
  const { addToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const handleCreate = () => {
    setStaffToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (staff) => {
    setStaffToEdit(staff);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (staffToDelete) {
      await deleteStaff(staffToDelete.id);
      addToast(`Staff member "${staffToDelete.name}" removed`, 'info');
      setStaffToDelete(null);
    }
  };

  const handleToggle = async (staff) => {
    await toggleStaffStatus(staff.id);
    const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
    addToast(`${staff.name} is now ${newStatus}`, 'info');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text-main)' }}>Restaurant Staff & Shifts</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Manage kitchen staff, waitstaff, supervisors, and working shifts
          </p>
        </div>

        <button onClick={handleCreate} className="btn btn-primary btn-sm">
          <Plus size={16} />
          Add Staff Member
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Member Name</th>
              <th>Contact Phone</th>
              <th>Role</th>
              <th>Shift Assignment</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                  {staff.id}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={staff.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80'}
                      alt={staff.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{staff.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{staff.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{staff.phone}</td>
                <td>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: staff.role === 'Manager' ? '#EFF6FF' : staff.role === 'Kitchen Staff' ? '#FEF3C7' : '#F4EFEA',
                      color: staff.role === 'Manager' ? '#1D4ED8' : staff.role === 'Kitchen Staff' ? '#B45309' : '#44403C',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {staff.role === 'Manager' ? <Shield size={12} /> : <ChefHat size={12} />}
                    {staff.role}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {staff.shift}
                </td>
                <td>
                  <button
                    onClick={() => handleToggle(staff)}
                    className={`badge ${staff.status === 'Active' ? 'badge-success' : 'badge-danger'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {staff.status}
                  </button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => handleEdit(staff)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem' }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setStaffToDelete(staff)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem', color: 'var(--color-danger)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StaffFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        staffToEdit={staffToEdit}
      />

      <ConfirmDialog
        isOpen={!!staffToDelete}
        onClose={() => setStaffToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Staff Member"
        message={`Are you sure you want to remove ${staffToDelete?.name} from active staff?`}
      />
    </div>
  );
};
