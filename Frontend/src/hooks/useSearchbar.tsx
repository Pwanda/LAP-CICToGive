import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAllItems } from "./useAPI";
import { searchSchema, type SearchFormData } from "../schemas/ItemSchemas.ts";

export const useSearchbar = () => {
  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: "",
      selectedCategory: "Alle",
    },
  });

  const { data: items = [], isLoading, error } = useAllItems();
  const { watch } = form;
  const searchTerm = watch("searchTerm");
  const selectedCategory = watch("selectedCategory");

  // Define categories - keep it simple
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(items.map((item) => item.category)),
    );
    return ["Alle", ...uniqueCategories.sort()];
  }, [items]);

  // Filter items based on search term and category
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (selectedCategory && selectedCategory !== "Alle") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [items, selectedCategory, searchTerm]);

  return {
    form,
    selectedCategory,
    filteredItems,
    categories,
    isLoading,
    error,
  };
};
