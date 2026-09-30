import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodDetailsModal } from '../../components/customer/FoodDetailsModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Heart } from 'lucide-react';

export const FavoritesPage = () => {
  const { foods, favorites } = useRestaurant();
  const [selectedFood, setSelectedFood] = useState(null);

  const favFoods = foods.filter((f) => favorites.includes(f.id));

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-text-main)' }}>Your Favorite Dishes</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Quickly reorder and view the items you have saved to your favorites
        </p>
      </div>

      {favFoods.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {favFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onClickDetails={(item) => setSelectedFood(item)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No Favorites Yet"
          description="Browse our menu and tap the heart icon on any dish to save it here for quick access."
          actionText="Browse Menu"
          actionLink="/menu"
        />
      )}

      <FoodDetailsModal
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
