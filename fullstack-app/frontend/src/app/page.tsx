"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authApi, itemsApi, Item } from "@/services/api";

const CATEGORIES = [
  "All",
  "Electronics",
  "Furniture",
  "Clothing",
  "Sports",
  "Books",
  "Toys",
  "Vehicles",
  "Real Estate",
  "Services",
  "Other",
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setIsLoggedIn(authApi.isLoggedIn());
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const resp = await itemsApi.getAll(
          0,
          8,
          category !== "All" ? category : undefined,
          search.trim() !== "" ? search : undefined,
          "createdAt",
          "desc",
        );
        setItems(resp.items);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [category, search]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Hero Section */}
        <section className="w-full max-w-3xl text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-black mb-4 tracking-tight">
            Willkommen bei <span className="text-green-600">CIC to Give</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8">
            Die kostenlose Plattform zum Verschenken und Finden von Dingen in
            deiner Nachbarschaft.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/items"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition duration-300"
            >
              Browse Items
            </Link>
            {isLoggedIn ? (
              <Link
                href="/items/new"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-md border border-green-600 transition duration-300"
              >
                Give Item
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-md border border-green-600 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-50 text-green-700 hover:bg-green-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-md border border-green-200 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Filterbar wie bei Willhaben */}
        <section className="w-full max-w-4xl mb-8">
          <form
            className="flex flex-col sm:flex-row gap-3 items-center bg-white rounded-xl shadow px-4 py-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Was suchst du?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-200"
              disabled={loading}
            >
              Suchen
            </button>
          </form>
        </section>

        {/* Item-Vorschau Grid */}
        <section className="w-full max-w-6xl mb-16">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">
            {category === "All" && !search
              ? "Neueste Angebote"
              : "Suchergebnisse"}
          </h2>
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium text-black mb-2">
                Keine passenden Items gefunden
              </h3>
              <p className="text-black">
                Versuche es mit einer anderen Kategorie oder Suche.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <Link
                  href={`/items/${item.id}`}
                  key={item.id}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {item.imageUrls && item.imageUrls.length > 0 ? (
                      <img
                        src={`http://localhost:8080${item.imageUrls[0]}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-black">
                        <svg
                          className="h-12 w-12"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-black truncate group-hover:text-green-600 transition-colors duration-200">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-black line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-black">
                      {item.location && (
                        <span className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <footer className="bg-white shadow py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-black text-sm">
            CICTOGIVE - Free Item Exchange Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
