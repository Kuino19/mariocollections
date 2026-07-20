'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DeleteProductButton from './products/DeleteProductButton';
import { Product } from '@/lib/data';
import { updateOrderStatus, deleteReview } from './actions';

export default function AdminDashboardClient({ 
  initialProducts, 
  orders = [], 
  users = [], 
  reviews = [] 
}: { 
  initialProducts: Product[], 
  orders?: any[], 
  users?: any[], 
  reviews?: any[] 
}) {
  const router = useRouter();
  
  // Inventory State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Tabs State
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'customers' | 'reviews'>('inventory');

  // Actions State
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Computed Inventory
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchTerm, categoryFilter]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const categories = Array.from(new Set(initialProducts.map(p => p.category)));

  // Computed Stats
  const totalProducts = initialProducts.length;
  const inStockProducts = initialProducts.filter(p => p.inStock).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  // Action Handlers
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      toast.success('Order status updated');
      router.refresh();
    } else {
      toast.error(res.error || 'Failed to update order');
    }
    setIsUpdating(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setIsUpdating(reviewId);
    const res = await deleteReview(reviewId);
    if (res.success) {
      toast.success('Review deleted');
      router.refresh();
    } else {
      toast.error(res.error || 'Failed to delete review');
    }
    setIsUpdating(null);
  };

  return (
    <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8 px-4 sm:px-0">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
          <dt className="truncate text-sm font-medium text-gray-500">Total Revenue</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-[#D4AF37]">₦{totalRevenue.toLocaleString()}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
          <dt className="truncate text-sm font-medium text-gray-500">Total Orders</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalOrders}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
          <dt className="truncate text-sm font-medium text-gray-500">Total Customers</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{users.length}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
          <dt className="truncate text-sm font-medium text-gray-500">In Stock</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">{inStockProducts} / {totalProducts}</dd>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 pb-4">
        <div className="flex gap-6 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['inventory', 'orders', 'customers', 'reviews'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-xl font-bold leading-7 sm:text-2xl capitalize whitespace-nowrap ${
                activeTab === tab ? 'text-gray-900 border-b-2 border-[#D4AF37]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-md bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#b5952f] transition-colors whitespace-nowrap"
        >
          + Add New Product
        </Link>
      </div>

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="animate-in fade-in duration-300">
          <div className="px-4 sm:px-0 mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products by name or slug..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="block w-full rounded-md border-0 py-2 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] sm:text-sm sm:leading-6 shadow-sm"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#D4AF37] sm:text-sm sm:leading-6 shadow-sm capitalize"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paginatedProducts.length > 0 ? (
                        paginatedProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="flex items-center">
                                <div className="h-12 w-12 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                  {product.images[0] ? (
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{product.name}</div>
                                  <div className="text-gray-500 text-xs mt-0.5">{product.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{product.category.replace('-', ' ')}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {product.mode === 'rent' ? (
                                <span title={`Deposit: ₦${product.rentDeposit?.toLocaleString()}`}>₦{product.rentPrice?.toLocaleString()}/d</span>
                              ) : product.mode === 'sale' ? (
                                <span>₦{product.salePrice?.toLocaleString()}</span>
                              ) : (
                                <div className="flex flex-col gap-1">
                                  <span>Sale: ₦{product.salePrice?.toLocaleString()}</span>
                                  <span className="text-xs text-gray-400">Rent: ₦{product.rentPrice?.toLocaleString()}/d</span>
                                </div>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                product.inStock ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'
                              }`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Link href={`/admin/products/${product.id}/edit`} className="text-[#D4AF37] hover:text-[#b5952f] mr-4">Edit</Link>
                              <DeleteProductButton id={product.id} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={5} className="py-10 text-center text-sm text-gray-500">No products found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 px-4 sm:px-0">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn">Previous</button>
              <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn">Next</button>
            </div>
          )}
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="animate-in fade-in duration-300">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID & Date</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer Details</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Items Ordered</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.length > 0 ? (
                  orders.map((order) => {
                    let itemsList: any[] = [];
                    try {
                      itemsList = Array.isArray(order.items) ? order.items : JSON.parse(order.items as string);
                    } catch(e) {}
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900 font-mono text-xs">{order.id}</div>
                          <div className="text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
                          <div className="text-xs text-gray-400 mt-1">Ref: {order.paymentRef}</div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{order.customerEmail}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{order.customerPhone}</div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <ul className="list-disc pl-4 text-xs">
                            {itemsList.map((item: any, i: number) => (
                              <li key={i}>{item.quantity}x {item.name} {item.size && `(Sz: ${item.size})`}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-[#D4AF37]">
                          ₦{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <select
                            value={order.status.toLowerCase()}
                            disabled={isUpdating === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#D4AF37] sm:text-xs sm:leading-6"
                          >
                            <option value="paid">Paid (New)</option>
                            <option value="processing">Processing / Tailoring</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {isUpdating === order.id && <span className="text-xs text-blue-500 ml-1">Saving...</span>}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="py-10 text-center text-sm text-gray-500">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="animate-in fade-in duration-300">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Customer</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact Details</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Orders</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div>{user.email}</div>
                        <div className="text-xs text-gray-400 mt-1">{user.phone || 'No phone'}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                        {user._count?.orders || 0}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="py-10 text-center text-sm text-gray-500">No customers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="animate-in fade-in duration-300">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Comment</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{review.product.name}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                        {review.rating} / 5
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {review.comment}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {review.authorName} <br/>
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button 
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={isUpdating === review.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {isUpdating === review.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="py-10 text-center text-sm text-gray-500">No reviews found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
