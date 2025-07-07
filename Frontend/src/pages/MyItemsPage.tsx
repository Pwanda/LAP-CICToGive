import { useState, useMemo, useEffect } from "react";
import ItemCard from "../components/HomePage/ItemCard";
import type { Item } from "../types";
import ItemModal from "../components/HomePage/ItemModal";
import CreateItemModal from "../components/HomePage/CreateItemModal";
import EditItemModal from "../components/HomePage/EditItemModal";
import { useCreateItem, useMyItems } from "../hooks/useAPI";
import { useForm } from "react-hook-form";

type CreateItemFormData = {
  title: string;
  description: string;
  category: string;
  location: string;
  condition: string;
  images?: FileList;
};

const categories = [
  "Alle",
  "Elektronik",
  "Möbel",
  "Kleidung",
  "Bücher",
  "Sport",
  "Sonstiges",
];

export default function MyItemsPage() {
  const { data: myItems = [], isLoading, error } = useMyItems();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [searchTerm, setSearchTerm] = useState("");
  const createItemMutation = useCreateItem();

  const { register, setValue } = useForm({
    defaultValues: {
      searchTerm: "",
      selectedCategory: "Alle",
    },
  });

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    let filtered = [...myItems];

    // Filter by category
    if (selectedCategory !== "Alle") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.location.toLowerCase().includes(search),
      );
    }

    return filtered;
  }, [myItems, selectedCategory, searchTerm]);

  // Pagination logic
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleEditItem = (item: Item) => {
    setEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditItem(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue("selectedCategory", category);
    setCurrentPage(1);
  };

  // Reset page when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredItems.length]);

  const handleCreateItem = async (data: CreateItemFormData) => {
    try {
      const itemData = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        condition: data.condition,
        images: data.images ? Array.from(data.images) : undefined,
      };

      await createItemMutation.mutateAsync(itemData);
      console.log("Item created successfully!");
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen h-full bg-base-200 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-lg">Lade deine Artikel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen h-full bg-base-200 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-semibold mb-2">
            Fehler beim Laden der Artikel
          </h3>
          <p className="text-base-content/60">
            Bitte versuchen Sie es später erneut
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-base-200 w-full relative">
      <div className="w-4/5 mx-auto flex justify-center items-center flex-col">
        {/* Hero Section */}
        <div className="hero text-primary-content pt-28 pb-10 w-full">
          <div className="hero-content text-center prose">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">Meine Artikel</h1>
              <p className="text-lg mb-8 opacity-90">
                Verwalte deine hochgeladenen Artikel - bearbeite, lösche oder
                füge neue hinzu
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats shadow mb-6">
          <div className="stat">
            <div className="stat-title">Gesamt Artikel</div>
            <div className="stat-value">{myItems.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Reserviert</div>
            <div className="stat-value text-warning">
              {myItems.filter((item) => item.isReserved).length}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Verfügbar</div>
            <div className="stat-value text-success">
              {myItems.filter((item) => !item.isReserved).length}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mt-6 w-full">
          {categories.map((category) => (
            <button
              key={category}
              className={`btn btn-lg ${
                selectedCategory === category ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="py-4 mb-7 mt-5 flex flex-col gap-10 justify-center items-center w-full">
          <label className="input input-xl input-neutral w-full">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              placeholder="Suche in meinen Artikeln..."
              {...register("searchTerm")}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center w-full pb-6">
          {currentItems.map((item) => (
            <ItemCard key={item.id} item={item} onItemClick={handleItemClick} />
          ))}
          {filteredItems.length === 0 && myItems.length > 0 && (
            <div className="text-center py-12 mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2">Keine Ergebnisse</h3>
              <p className="text-base-content/60">
                Versuche andere Suchbegriffe oder Kategorien
              </p>
            </div>
          )}
          {myItems.length === 0 && (
            <div className="text-center py-12 mx-auto">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold mb-2">Keine Artikel</h3>
              <p className="text-base-content/60">
                Erstelle deinen ersten Artikel mit dem + Button
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pb-14">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`join-item btn ${currentPage === page ? "btn-active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                className="join-item btn"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Plus Button - Unten Rechts */}
      <button
        className="btn btn-circle btn-primary fixed bottom-6 right-6 z-40 shadow-lg size-16"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="size-[1.2em]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      {/* Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditItem}
      />

      {/* Create Item Modal */}
      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateItem}
      />

      {/* Edit Item Modal */}
      <EditItemModal
        item={editItem}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
    </div>
  );
}
