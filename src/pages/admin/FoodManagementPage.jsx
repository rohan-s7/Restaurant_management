import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { FoodFormModal } from '../../components/admin/FoodFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatCurrency } from '../../utils/helpers';
import { Plus, Edit, Trash2, Search, Utensils, Star, CheckCircle, XCircle } from 'lucide-react';

export const FoodManagementPage = () => {
  const { foods, categories, deleteFood, toggleFoodAvailability } = useRestaurant();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState(null);
  const [foodToDelete, setFoodToDelete] = useState(null);

  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || food.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleEdit = (food) => {
    setFoodToEdit(food);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setFoodToEdit(null);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (foodToDelete) {
      await deleteFood(foodToDelete.id);
      addToast(`Deleted "${foodToDelete.name}" from menu`, 'info');
      setFoodToDelete(null);
    }
  };

  return (
    <div>
      {/* Top action header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text-main)' }}>Food Menu Inventory</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Manage menu items, live prices, recipes, and availability status
          </p>
        </div>

        <button onClick={handleCreate} className="btn btn-primary btn-sm">
          <Plus size={16} />
          Add New Dish
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px' }}
            placeholder="Search dish by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Category:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.filter((c) => c.id !== 'all').map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Foods Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Category</th>
              <th>Diet</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Availability</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFoods.map((food) => (
              <tr key={food.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={food.image}
                      alt={food.name}
                      style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80';
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{food.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {food.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.85rem' }}>
                  {food.category?.replace('-', ' ')}
                </td>
                <td>
                  <span className={`dietary-indicator ${food.isVeg ? 'veg' : 'non-veg'}`} title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'} />
                </td>
                <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                  {formatCurrency(food.price)}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <span>{food.rating || '4.8'}</span>
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => toggleFoodAvailability(food.id)}
                    className={`badge ${food.available ? 'badge-success' : 'badge-danger'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {food.available ? 'In Stock' : 'Out of Stock'}
                  </button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => handleEdit(food)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem' }}
                      title="Edit dish"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setFoodToDelete(food)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem', color: 'var(--color-danger)' }}
                      title="Delete dish"
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

      {/* Form modal */}
      <FoodFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        foodToEdit={foodToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!foodToDelete}
        onClose={() => setFoodToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Menu Dish"
        message={`Are you sure you want to permanently delete "${foodToDelete?.name}" from the menu?`}
      />
    </div>
  );
};
