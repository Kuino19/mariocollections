'use client';

import { useState } from 'react';
import { saveProduct } from './actions';
import { Product } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(product?.mode || 'both');
  
  // Track existing images so users can see what they're keeping
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // Re-append existing images that haven't been removed
      existingImages.forEach(img => {
        formData.append('existingImages', img);
      });

      const result = await saveProduct(formData, product?.id);
      if (result && result.success) {
        window.location.href = '/admin';
      } else if (result && result.error) {
        alert('Failed to save: ' + result.error);
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      alert('Failed to save product: ' + (error?.message || 'Unknown error'));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid rgba(59,18,32,0.1)' }}>
        <h2 style={{ color: 'var(--wine-deep)', marginBottom: '24px' }}>{product ? 'Edit Product' : 'Add New Product'}</h2>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Product Name *</label>
            <input type="text" name="name" defaultValue={product?.name} required placeholder="e.g. Red Corset Ododo (Edo) Dress" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Category *</label>
              <select name="category" defaultValue={product?.category || 'gowns'} required>
                <option value="female-traditional">Female Traditional</option>
                <option value="male-traditional">Male Traditional</option>
                <option value="gowns">Gowns</option>
                <option value="suits">Suits</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
                <option value="fans">Fans</option>
                <option value="souvenirs">Souvenirs</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Available For *</label>
              <select name="mode" value={mode} onChange={(e) => setMode(e.target.value)} required>
                <option value="both">Sale & Rent</option>
                <option value="sale">Sale Only</option>
                <option value="rent">Rent Only</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Sale Price (₦)</label>
              <input type="number" name="salePrice" defaultValue={product?.salePrice || ''} placeholder="88000" disabled={mode === 'rent'} required={mode !== 'rent'} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Rent Price (₦)</label>
              <input type="number" name="rentPrice" defaultValue={product?.rentPrice || ''} placeholder="26000" disabled={mode === 'sale'} required={mode !== 'sale'} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Rent Deposit (₦)</label>
              <input type="number" name="rentDeposit" defaultValue={product?.rentDeposit || ''} placeholder="13000" disabled={mode === 'sale'} required={mode !== 'sale'} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Description</label>
            <textarea name="description" defaultValue={product?.description || ''} rows={4} placeholder="Describe the item, fabric, styling tips..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Measurements</label>
              <input type="text" name="measurements" defaultValue={product?.measurements || ''} placeholder="e.g. BUST- 35, WAIST- 29, HIP- 40" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Sizes (comma separated)</label>
              <input type="text" name="sizes" defaultValue={product?.sizes?.join(', ') || ''} placeholder="e.g. S, M, L, XL" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Included Accessories</label>
            <input type="text" name="accessories" defaultValue={product?.accessories || ''} placeholder="e.g. HORSETAIL, HEAD BEADS" />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer' }}>
              <input type="checkbox" name="inStock" value="true" defaultChecked={product ? product.inStock : true} style={{ width: 'auto' }} />
              Item is currently In Stock
            </label>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid rgba(59,18,32,0.1)' }}>
        <h3 style={{ color: 'var(--wine-deep)', marginBottom: '16px' }}>Images</h3>
        
        {existingImages.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>Current Images (click to remove):</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {existingImages.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => handleRemoveExistingImage(i)}
                  style={{ 
                    position: 'relative', width: '100px', height: '125px', 
                    borderRadius: '6px', overflow: 'hidden', cursor: 'pointer',
                    border: '2px solid transparent'
                  }}
                  title="Click to remove"
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'red'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <Image src={img} alt="Current" fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,0,0,0.2)', opacity: 0 }} className="hover-overlay" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Upload New Images</label>
          <input type="file" name="images" accept="image/*" multiple style={{ padding: '12px 0', border: 'none' }} />
          <p style={{ fontSize: '0.85rem', color: '#666' }}>You can select multiple files. Images will be automatically uploaded to Cloudinary.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        <Link href="/admin" className="btn btn-outline-wine">Cancel</Link>
        <button type="submit" className="btn btn-gold" disabled={loading}>
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}
