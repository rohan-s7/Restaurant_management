import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { TableFormModal } from '../../components/admin/TableFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit, Trash2, Users, Grid } from 'lucide-react';

export const TableManagementPage = () => {
  const { tables, deleteTable } = useRestaurant();
  const { addToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tableToEdit, setTableToEdit] = useState(null);
  const [tableToDelete, setTableToDelete] = useState(null);

  const handleCreate = () => {
    setTableToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (table) => {
    setTableToEdit(table);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (tableToDelete) {
      await deleteTable(tableToDelete.id);
      addToast(`Table ${tableToDelete.number} deleted`, 'info');
      setTableToDelete(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text-main)' }}>Dining Room Seating Architecture</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Configure floor tables, seat capacities, and spatial dining sections
          </p>
        </div>

        <button onClick={handleCreate} className="btn btn-primary btn-sm">
          <Plus size={16} />
          Add Table
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {tables.map((table) => {
          const isAvail = table.status === 'Available';
          const isOcc = table.status === 'Occupied';

          return (
            <div
              key={table.id}
              className="card"
              style={{
                padding: '1.5rem',
                borderLeft: `5px solid ${isAvail ? 'var(--color-success)' : isOcc ? 'var(--color-danger)' : 'var(--color-warning)'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1.3rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Table {table.number}
                </h4>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: isAvail ? 'var(--color-success-bg)' : isOcc ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                    color: isAvail ? 'var(--color-success)' : isOcc ? 'var(--color-danger)' : 'var(--color-warning)'
                  }}
                >
                  {table.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <Users size={15} />
                <span>Capacity: <strong>{table.capacity} Persons</strong></span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginBottom: '1.25rem' }}>
                Location: {table.location || 'Main Floor'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => handleEdit(table)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem 0.65rem' }}
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => setTableToDelete(table)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem 0.65rem', color: 'var(--color-danger)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <TableFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        tableToEdit={tableToEdit}
      />

      <ConfirmDialog
        isOpen={!!tableToDelete}
        onClose={() => setTableToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Dining Table"
        message={`Are you sure you want to delete Table ${tableToDelete?.number}?`}
      />
    </div>
  );
};
