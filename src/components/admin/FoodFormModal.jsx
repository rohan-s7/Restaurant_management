import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';

export const FoodFormModal = ({ isOpen, onClose, foodToEdit = null }) => {
  const { categories, addFood, updateFood } = useRestaurant();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'starters',
    price: '',
    description: '',
    ingredients: '',
    image: '',
    isVeg: true,
    available: true,
    preparationTime: '15 mins',
    isPopular: false,
    isSpecial: false
  });

  useEffect(() => {
    if (foodToEdit) {
      setFormData({
        name: foodToEdit.name || '',
        category: foodToEdit.category || 'starters',
        price: foodToEdit.price || '',
        description: foodToEdit.description || '',
        ingredients: Array.isArray(foodToEdit.ingredients) ? foodToEdit.ingredients.join(', ') : '',
        image: foodToEdit.image || '',
        isVeg: foodToEdit.isVeg !== undefined ? foodToEdit.isVeg : true,
        available: foodToEdit.available !== undefined ? foodToEdit.available : true,
        preparationTime: foodToEdit.preparationTime || '15 mins',
        isPopular: !!foodToEdit.isPopular,
        isSpecial: !!foodToEdit.isSpecial
      });
    } else {
      setFormData({
        name: '',
        category: 'starters',
        price: '',
        description: '',
        ingredients: '',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        isVeg: true,
        available: true,
        preparationTime: '15 mins',
        isPopular: false,
        isSpecial: false
      });
    }
  }, [foodToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      addToast('Please fill all required fields', 'warning');
      return;
    }

    const ingredientsList = formData.ingredients
      ? formData.ingredients.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      price: Number(formData.price),
      ingredients: ingredientsList
    };

    if (foodToEdit) {
      await updateFood(foodToEdit.id, payload);
      addToast(`Updated "${payload.name}" successfully`, 'success');
    } else {
      await addFood(payload);
      addToast(`Added new dish "${payload.name}"`, 'success');
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={foodToEdit ? `Edit Dish: ${foodToEdit.name}` : 'Add New Food Item'}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Dish Name *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Gourmet Truffle Pasta"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Price in ₹ *</label>
            <input
              type="number"
              className="form-control"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="249"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prep Time</label>
            <input
              type="text"
              className="form-control"
              value={formData.preparationTime}
              onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
              placeholder="15-20 mins"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Food Image URL</label>
          <input
            type="url"
            className="form-control"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe flavors, cooking method and presentation..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ingredients (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={formData.ingredients}
            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            placeholder="Cheese, Garlic, Oregano, Tomatoes"
          />
        </div>

        {/* Toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={formData.isVeg}
              onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
            />
            Vegetarian
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            Available
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={formData.isPopular}
              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
            />
            Popular
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={formData.isSpecial}
              onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
            />
            Today's Special
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            {foodToEdit ? 'Save Changes' : 'Create Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
