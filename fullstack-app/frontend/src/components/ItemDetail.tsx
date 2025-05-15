"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Item, itemsApi, authApi } from '@/services/api';
import Link from 'next/link';

interface ItemDetailProps {
  itemId: number;
}

export default function ItemDetail({ itemId }: ItemDetailProps) {
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const fetchedItem = await itemsApi.getById(itemId);
        setItem(fetchedItem);
        setError(null);
      } catch (err) {
        setError('Failed to fetch item details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [itemId]);
  
  // Price formatting removed as all items are now free
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-AT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Handle image navigation
  const nextImage = () => {
    if (item?.imageUrls && currentImageIndex < item.imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  // Check if current user is the owner
  const isOwner = () => {
    const currentUser = authApi.getCurrentUser();
    return currentUser && item?.user && currentUser.id === item.user.id;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    );
  }
  
  if (error || !item) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error || 'Item not found'}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="lg:flex">
        {/* Image gallery */}
        <div className="lg:w-3/5">
          <div className="relative h-72 sm:h-96 lg:h-[500px] bg-gray-100">
            {item.imageUrls && item.imageUrls.length > 0 ? (
              <>
                <img
                  src={item.imageUrls[currentImageIndex]}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
                
                {/* Image navigation */}
                {item.imageUrls.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className="bg-white rounded-full p-3 shadow-lg disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === item.imageUrls.length - 1}
                      className="bg-white rounded-full p-3 shadow-lg disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Image counter */}
                {item.imageUrls.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="bg-black bg-opacity-60 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {item.imageUrls.length}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="h-24 w-24 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Thumbnail gallery */}
          {item.imageUrls && item.imageUrls.length > 1 && (
            <div className="p-4 flex space-x-3 overflow-x-auto">
              {item.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex ? 'border-green-500 shadow-md' : 'border-transparent hover:border-green-300'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Item details */}
        <div className="lg:w-2/5 p-6 lg:p-8">
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
                {item.category}
              </div>
              <div className="text-sm text-gray-500">
                ID: {item.id}
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
            <p className="text-xl sm:text-2xl font-bold text-green-600 mb-6" style={{ color: 'var(--primary)' }}>Free</p>
            
            {item.location && (
              <div className="flex items-center text-gray-600 mb-6">
                <svg className="h-5 w-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--primary)' }}>
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{item.location}</span>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--primary)' }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Giver Information</h2>
              <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xl" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
                  {item.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">{item.user?.username || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">Posted on {formatDate(item.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {isOwner() ? (
                <>
                  <Link
                    href={`/items/${item.id}/edit`}
                    className="flex-1 bg-green-600 text-black py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center font-medium transition-colors duration-200"
                    style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
                  >
                    Edit Item
                  </Link>
                  <Link
                    href="/items/my-items"
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center font-medium transition-colors duration-200"
                  >
                    My Items
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={`mailto:${item.user?.email || ''}`}
                    className="flex-1 bg-green-600 text-black py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center font-medium transition-colors duration-200 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Contact Giver
                  </Link>
                  <button
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center font-medium transition-colors duration-200 flex items-center justify-center"
                    onClick={() => window.history.back()}
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Listings
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar items section */}
      <div className="border-t border-gray-200 mt-8 pt-8 px-6 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* This would be populated with similar items in a real implementation */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600">Similar items would appear here based on category and other factors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
