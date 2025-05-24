'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, RefreshCw, Plus, Eye } from 'lucide-react'
import { AddCategoryModal } from '@/components/menus/add-category-modal'
import { MenuCategory } from '@/components/menus/menu-category'
import { Category } from '@/types/menu'
import { AttributeTypesModal } from '@/components/menus/attribute-types-modal'
import PageLayout from "@/components/layout/page-layout"
import { toast } from 'react-hot-toast'
import axios from 'axios'
import api from '@/lib/axios'
import { BaseUrl } from '@/lib/config'
import CommonHeader from '@/components/layout/common-header'

export default function MenuSetupPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAttributeTypesModalOpen, setIsAttributeTypesModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch categories and their products
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/categories');
        const { data } = response;
        
        if (data.success) {
          const transformedCategories = data.data.map((category: any) => ({
            id: category._id || category.id,
            name: category.name,
            description: category.description || '',
            hidden: category.hidden || false,
            includeAttributes: category.includeAttributes || false,
            includeDiscounts: category.includeDiscounts || false,
            items: []
          }));
          
          setCategories(transformedCategories);
        } else {
          throw new Error(data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory: Omit<Category, 'id'>) => {
    try {
      const response = await api.post('/categories', newCategory);
      const { data } = response;
      
      if (data.success) {
        const savedCategory: Category = {
          ...newCategory,
          id: data.data._id || data.data.id
        };
        
        setCategories(prev => [...prev, savedCategory]);
        toast.success('Category added successfully');
      } else {
        throw new Error(data.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await api.delete(`/categories/${categoryId}`);
      const { data } = response;
      
      if (data.success) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        toast.success('Category deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      const response = await api.put(`/categories/${updatedCategory.id}`, updatedCategory);
      const { data } = response;
      
      if (data.success) {
        setCategories(prev => 
          prev.map(cat => 
            cat.id === updatedCategory.id ? updatedCategory : cat
          )
        );
        toast.success('Category updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageLayout>
      {/* Header */}
      <CommonHeader />
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Menu Setup</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600"
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <MenuCategory
                key={category.id}
                category={category}
                onDelete={handleDeleteCategory}
                onUpdate={handleUpdateCategory}
                allCategories={categories}
              />
            ))}
          </div>
        )}

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
  )
} 