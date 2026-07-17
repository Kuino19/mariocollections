'use client';

import { useState } from 'react';
import { deleteProduct } from './actions';

export default function DeleteProductButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await deleteProduct(id);
      } catch (e) {
        console.error(e);
        alert('Failed to delete product');
        setLoading(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 ml-4 disabled:opacity-50"
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}
