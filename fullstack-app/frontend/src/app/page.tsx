"use client";

import { useState } from 'react';
import { Item, authApi } from '@/services/api';
import ItemList from '@/components/ItemList';
import AddItemForm from '@/components/AddItemForm';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Function to handle when a new item is added
  const handleItemAdded = (item: Item) => {
    // Increment the key to force a refresh of the ItemList component
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  // Check if user is logged in
  const isLoggedIn = typeof window !== 'undefined' ? authApi.isLoggedIn() : false;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-black" style={{ backgroundColor: 'var(--primary)', backgroundImage: 'linear-gradient(to right, var(--primary), var(--primary-dark))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Give and Receive Items Freely
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8">
                Your one-stop platform for giving away items you no longer need or finding free items.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/items" 
                  className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition duration-300"
                  style={{ color: 'var(--primary)' }}
                >
                  Browse Items
                </Link>
                {isLoggedIn ? (
                  <Link 
                    href="/items/new" 
                    className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-semibold text-lg shadow-md border border-green-400 transition duration-300"
                    style={{ backgroundColor: 'var(--primary-dark)', borderColor: 'var(--primary)' }}
                  >
                    Give an Item
                  </Link>
                ) : (
                  <Link 
                    href="/login" 
                    className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-semibold text-lg shadow-md border border-green-400 transition duration-300"
                    style={{ backgroundColor: 'var(--primary-dark)', borderColor: 'var(--primary)' }}
                  >
                    Login to Give
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-full h-full bg-green-500 rounded-lg" style={{ backgroundColor: 'var(--primary)' }}></div>
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-green-700 rounded-lg" style={{ backgroundColor: 'var(--primary-dark)' }}></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-100 p-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-light)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-light)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-light)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-light)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Categories */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/items?category=Electronics" className="group">
              <div className="bg-green-50 rounded-lg p-6 text-center transition-all duration-300 group-hover:bg-green-100 group-hover:shadow-md" style={{ backgroundColor: 'rgba(var(--primary-light), 0.2)' }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 group-hover:bg-green-200" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Electronics</h3>
                <p className="text-sm text-gray-500">Phones, Computers, TVs</p>
              </div>
            </Link>
            <Link href="/items?category=Furniture" className="group">
              <div className="bg-green-50 rounded-lg p-6 text-center transition-all duration-300 group-hover:bg-green-100 group-hover:shadow-md" style={{ backgroundColor: 'rgba(var(--primary-light), 0.2)' }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 group-hover:bg-green-200" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Furniture</h3>
                <p className="text-sm text-gray-500">Sofas, Tables, Chairs</p>
              </div>
            </Link>
            <Link href="/items?category=Clothing" className="group">
              <div className="bg-green-50 rounded-lg p-6 text-center transition-all duration-300 group-hover:bg-green-100 group-hover:shadow-md" style={{ backgroundColor: 'rgba(var(--primary-light), 0.2)' }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 group-hover:bg-green-200" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Clothing</h3>
                <p className="text-sm text-gray-500">Shirts, Pants, Shoes</p>
              </div>
            </Link>
            <Link href="/items?category=Vehicles" className="group">
              <div className="bg-green-50 rounded-lg p-6 text-center transition-all duration-300 group-hover:bg-green-100 group-hover:shadow-md" style={{ backgroundColor: 'rgba(var(--primary-light), 0.2)' }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 group-hover:bg-green-200" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Vehicles</h3>
                <p className="text-sm text-gray-500">Cars, Bikes, Boats</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Latest Items
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Item List */}
            <div className="lg:col-span-3">
              <ItemList key={refreshKey} />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Add Item Form */}
              {isLoggedIn ? (
                <AddItemForm onItemAdded={handleItemAdded} />
              ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Want to give something away?
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Login to your account to start giving away items on our platform.
                    </p>
                    <Link 
                      href="/login" 
                      className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
                    >
                      Login
                    </Link>
                    <div className="mt-4 text-center text-sm text-gray-500">
                      Don't have an account?{' '}
                      <Link href="/register" className="text-green-600 hover:text-green-500" style={{ color: 'var(--primary)' }}>
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {/* How It Works */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    How It Works
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Create an account</h3>
                        <p className="text-sm text-gray-500">Sign up for free in just a few seconds.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                          2
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">List your items</h3>
                        <p className="text-sm text-gray-500">Add photos and description of items you want to give away.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                          3
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Give & share</h3>
                        <p className="text-sm text-gray-500">Connect with recipients and arrange the handover.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-black py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LapCIC</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop platform for giving away and receiving items for free.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-black">Home</Link></li>
                <li><Link href="/items" className="text-gray-400 hover:text-black">Browse Items</Link></li>
                <li><Link href="/items/new" className="text-gray-400 hover:text-black">Give an Item</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link href="/items?category=Electronics" className="text-gray-400 hover:text-black">Electronics</Link></li>
                <li><Link href="/items?category=Furniture" className="text-gray-400 hover:text-black">Furniture</Link></li>
                <li><Link href="/items?category=Clothing" className="text-gray-400 hover:text-black">Clothing</Link></li>
                <li><Link href="/items?category=Vehicles" className="text-gray-400 hover:text-black">Vehicles</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-black">Login</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-black">Register</Link></li>
                <li><Link href="/items/my-items" className="text-gray-400 hover:text-black">My Items</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} LapCIC - Free Item Exchange Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
