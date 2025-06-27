"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authApi, itemsApi, Item } from "@/services/api";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

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
    const checkAuth = () => setIsLoggedIn(authApi.isLoggedIn());
    checkAuth();

    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
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
            Die kostenlose Plattform zum Verschenken und Finden von Dingen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            {!isLoggedIn ? (
              <>
                <div className="w-full sm:w-1/2">
                  <LoginForm />
                </div>
                <div className="w-full sm:w-1/2">
                  <RegisterForm />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/items"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition duration-300"
                >
                  Browse Items
                </Link>
                <Link
                  href="/items/new"
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-md border border-green-600 transition duration-300"
                >
                  Give Item
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Nur anzeigen, wenn eingeloggt */}
        {isLoggedIn && (
          <>
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
                      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-[28rem] w-full"
                    >
                      <div className="relative w-full h-48 min-h-[12rem] max-h-[12rem] bg-gray-200 overflow-hidden flex items-center justify-center">
                        {item.imageUrls && item.imageUrls.length > 0 ? (
                          <img
                            src={`http://localhost:8080${item.imageUrls[0]}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            style={{ objectFit: "cover" }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/fallback-image.png";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-black">
                            <img
                              src="/fallback-image.png"
                              alt="Fallback"
                              className="h-12 w-12 object-contain"
                            />
                          </div>
                        )}
                        {item.reserved && (
                          <div className="absolute top-3 left-3 z-20 bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md border border-yellow-500">
                            Reserviert
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          {item.category}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-black truncate group-hover:text-green-600 transition-colors duration-200">
                            {item.name}
                          </h3>
                          {item.reserved && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-300 text-yellow-900 border border-yellow-500">
                              Reserviert
                            </span>
                          )}
                        </div>
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
          </>
        )}
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
