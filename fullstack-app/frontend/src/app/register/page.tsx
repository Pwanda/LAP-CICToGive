"use client";

import RegisterForm from '@/components/RegisterForm';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-center items-center px-4 py-12 sm:px-0">
          <RegisterForm />
        </div>
      </main>
      
      <footer className="bg-white shadow mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            LapCIC - Free Item Exchange Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
