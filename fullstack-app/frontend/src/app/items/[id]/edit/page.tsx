"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Item, itemsApi, authApi } from '@/services/api';
import AddItemForm from '@/components/AddItemForm';
import Navbar from '@/components/Navbar';

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = Number(params.id);
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!authApi.isLoggedIn()) {
      router.push('/login');
      return;
    }
    
    const fetchItem = async () => {
      try {
        setLoading(true);
        const fetchedItem = await itemsApi.getById(itemId);
        
        // Check if the current user is the owner of the item
        const currentUser = authApi.getCurrentUser();
        if (!currentUser || !fetchedItem.user || currentUser.id !== fetchedItem.user.id) {
          setError('You do not have permission to edit this item');
          setTimeout(() => {
            router.push(`/items/${itemId}`);
          }, 2000);
          return;
        }
        
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
  }, [itemId, router]);
  
  const handleItemUpdated = (updatedItem: Item) => {
    // Redirect to item detail page after successful update
    router.push(`/items/${updatedItem.id}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Edit Item
            </h1>
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Edit Item
          </h1>
          
          <div className="max-w-3xl mx-auto">
            {item && <AddItemForm editItem={item} onItemAdded={handleItemUpdated} />}
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Willhaben Clone - Next.js Frontend + Spring Boot Backend
          </p>
        </div>
      </footer>
    </div>
  );
}
