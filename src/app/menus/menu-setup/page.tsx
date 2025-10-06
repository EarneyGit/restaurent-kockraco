"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Plus } from "lucide-react";
import { AddCategoryModal } from "@/components/menus/add-category-modal";
import { MenuCategory } from "@/components/menus/menu-category";
import { Category } from "@/types/menu";
import { AttributeTypesModal } from "@/components/menus/attribute-types-modal";
import PageLayout from "@/components/layout/page-layout";
import api from "@/lib/axios";
import CommonHeader from "@/components/layout/common-header";
import { toast } from "sonner";

export default function MenuSetupPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAttributeTypesModalOpen, setIsAttributeTypesModalOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/categories");
      const { data } = response;

      if (data.success) {
        const transformedCategories = data.data.map((category: any) => ({
          id: category._id || category.id,
          name: category.name,
          description: category.description || "",
          displayOrder: category.displayOrder ?? 0,
          hidden: category.hidden || false,
          includeAttributes: category.includeAttributes || false,
          includeDiscounts: category.includeDiscounts || false,
          imageUrl: category.imageUrl || "",
          availability: category.availability || {},
          printers: category.printers || ["Kitchen (P2)"],
          branch: category.branch,
          items: [],
        }));

        setCategories(transformedCategories);
      } else {
        throw new Error(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshTrigger]);

  //   try {
  //     const response = await api.post("/categories", newCategory);
  //     const { data } = response;

  //     if (data.success) {
  //       const savedCategory: Category = {
  //         ...newCategory,
  //         id: data.data._id || data.data.id,
  //       };

  //       setCategories((prev) => [savedCategory, ...prev]);

  //       toast.success("Category added successfully");

  //       // triggerRefresh();
  //     } else {
  //       throw new Error(data.message || "Failed to add category");
  //     }
  //   } catch (error) {
  //     console.error("Error adding category:", error);
  //     toast.error("Failed to add category");
  //   }
  // };

  // Simplify handleAddCategory to just update state

  const handleAddCategory = (newCategory: Category) => {
    setCategories((prev) => [newCategory, ...prev]);
    setCurrentPage(1);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await api.delete(`/categories/${categoryId}`);
      const { data } = response;

      if (data.success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
        toast.success("Category deleted successfully");
        triggerRefresh();
      } else {
        throw new Error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      const response = await api.put(
        `/categories/${updatedCategory.id}`,
        updatedCategory
      );
      const { data } = response;

      if (data.success) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          )
        );
        toast.success("Category updated successfully");
        triggerRefresh();
      } else {
        throw new Error(data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  // Filtering
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <PageLayout>
      <CommonHeader />

      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-medium">Menu Setup</h1>
          <div className="flex flex-wrap gap-4 items-center">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-yellow-500/80 hover:bg-yellow-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => setIsAttributeTypesModalOpen(true)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Attribute Types
            </Button>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Category List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-col-1">
              {paginatedCategories.map((category) => (
                <MenuCategory
                  key={category.id}
                  category={category}
                  onDelete={handleDeleteCategory}
                  onUpdate={handleUpdateCategory}
                  allCategories={categories}
                  onRefresh={triggerRefresh}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      className="w-10 h-10"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <AddCategoryModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCategory}
          onSuccess={async () => Promise.resolve()}
        />
        <AttributeTypesModal
          open={isAttributeTypesModalOpen}
          onClose={() => setIsAttributeTypesModalOpen(false)}
        />
      </div>
    </PageLayout>
  );
}
