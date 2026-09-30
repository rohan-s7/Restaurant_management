import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { Plus, Trash2, Layers, Utensils } from 'lucide-react';

export const CategoryManagementPage = () => {
  const { categories, addCategory, deleteCategory, foods } = useRestaurant();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [catToDelete, setCatToDelete] = useState(null);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    await addCategory({
      name: categoryName,
      icon: 'Utensils'
    });
    addToast(`Added category "${categoryName}"`, 'success');
    setCategoryName('');
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (catToDelete) {
      await deleteCategory(catToDelete.id);
      addToast(`Category "${catToDelete.name}" removed`, 'info');
      setCatToDelete(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text-main)' }}>Menu Categories</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Organize and classify dining menu items
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {categories.map((cat) => {
          const count = cat.id === 'all'
            ? foods.length
            : foods.filter((f) => f.category === cat.id).length;

          return (
            <div key={cat.id} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{cat.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {count} dishes listed
                  </div>
                </div>
              </div>

              {cat.id !== 'all' && (
                <button
                  onClick={() => setCatToDelete(cat)}
                  className="btn btn-secondary btn-icon"
                  style={{ color: 'var(--color-danger)', width: '32px', height: '32px' }}
                  title="Delete category"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Food Category" maxWidth="420px">
        <form onSubmit={handleAddCategory}>
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              className="form-control"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Sizzlers & Grills"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Create Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!catToDelete}
        onClose={() => setCatToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${catToDelete?.name}"?`}
      />
    </div>
  );
};
