"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddItemForm from '@/components/AddItemForm';
import Navbar from '@/components/Navbar';
import { authApi } from '@/services/api';

export default function NewItemPage() {
  const router = useRouter();
  
  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!authApi.isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Sell an Item
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <AddItemForm />
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
