"use client";

import RegisterForm from "@/components/RegisterForm";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-center items-center px-4 py-12 sm:px-0">
          <RegisterForm />
        </div>
      </main>

      <footer className="bg-white shadow py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-black text-sm">
            CICTOGIVE - Free Item Exchange Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
