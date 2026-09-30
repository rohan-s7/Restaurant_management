import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodDetailsModal } from '../../components/customer/FoodDetailsModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Search, SlidersHorizontal, Utensils, Sparkles, Filter } from 'lucide-react';

export const MenuPage = () => {
  const { foods, categories } = useRestaurant();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // 'ALL' | 'VEG' | 'NON_VEG'
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc' | 'rating'
  const [selectedFood, setSelectedFood] = useState(null);

  // Filter and sort items
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      // Search term
      const matchesSearch =
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (food.ingredients && food.ingredients.some((ing) => ing.toLowerCase().includes(searchTerm.toLowerCase())));

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || food.category === selectedCategory;

      // Dietary filter
      const matchesDiet =
        dietaryFilter === 'ALL'
          ? true
          : dietaryFilter === 'VEG'
          ? food.isVeg
          : !food.isVeg;

      return matchesSearch && matchesCategory && matchesDiet;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return 0;
    });
  }, [foods, searchTerm, selectedCategory, dietaryFilter, sortBy]);

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: 'var(--color-bg-light)', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Title */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Exquisite Gastronomy</span>
          <h1 className="section-title" style={{ fontSize: '3rem' }}>Our Menu</h1>
          <p className="section-description">
            Discover our delicious selection crafted by master chefs using artisanal spices and fresh organic ingredients.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div
          className="card"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '40px' }}
              placeholder="Search dishes or ingredients (e.g. Pizza, Paneer)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Veg / Non-Veg Toggle Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setDietaryFilter('ALL')}
              className={`btn btn-sm ${dietaryFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setDietaryFilter('VEG')}
              className={`btn btn-sm ${dietaryFilter === 'VEG' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span className="dietary-indicator veg" />
              Veg Only
            </button>
            <button
              onClick={() => setDietaryFilter('NON_VEG')}
              className={`btn btn-sm ${dietaryFilter === 'NON_VEG' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span className="dietary-indicator non-veg" />
              Non-Veg
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Sort by:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            marginBottom: '2rem',
            scrollbarWidth: 'none'
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text-main)',
                  border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  boxShadow: isSelected ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'var(--shadow-xs)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Result Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredFoods.length}</strong> delicious dishes
          </div>
          {(searchTerm || selectedCategory !== 'all' || dietaryFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setDietaryFilter('ALL');
              }}
              style={{ fontSize: '0.825rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Food Grid */}
        {filteredFoods.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onClickDetails={(item) => setSelectedFood(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Utensils}
            title="No dishes found"
            description="We could not find any menu items matching your search or filters. Try clearing your filters."
            actionText="View All Dishes"
            onActionClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setDietaryFilter('ALL');
            }}
          />
        )}
      </div>

      {/* Food Details Modal */}
      <FoodDetailsModal
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
