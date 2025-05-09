"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import Navbar from '@/components/Navbar';
import { authApi } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (authApi.isLoggedIn()) {
      router.push('/');
    }
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-center items-center px-4 py-12 sm:px-0">
          <LoginForm />
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
