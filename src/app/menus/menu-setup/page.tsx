'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, RefreshCw, Plus, Eye } from 'lucide-react'
import { AddCategoryModal } from '@/components/menus/add-category-modal'
import { MenuCategory } from '@/components/menus/menu-category'
import { Category } from '@/types/menu'
import { AttributeTypesModal } from '@/components/menus/attribute-types-modal'
import PageLayout from "@/components/layout/page-layout"
import { toast } from 'react-hot-toast'

// Dummy items to add to each category
const dummyItems = [
  {
    id: '1-1',
    name: 'Chicken Tikka Masala with Rice',
    price: 8.99,
    hideItem: false,
    delivery: true,
    collection: true,
    dineIn: true,
    description: 'Tender chicken pieces in a rich, creamy tomato sauce',
    weight: 450,
    calorificValue: '650 kcal',
    calorieDetails: 'Protein: 35g, Carbs: 75g, Fat: 22g'
  },
  {
    id: '1-2',
    name: 'Vegetable Biryani',
    price: 7.99,
    hideItem: false,
    delivery: true,
    collection: true,
    dineIn: true,
    description: 'Mixed vegetables and aromatic rice cooked with Indian spices',
    weight: 400,
    calorificValue: '550 kcal',
    calorieDetails: 'Protein: 12g, Carbs: 85g, Fat: 18g'
  }
]

export default function MenuSetupPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAttributeTypesModalOpen, setIsAttributeTypesModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch categories and their products
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('http://localhost:5000/api/categories')
      
      if (response.data.success) {
        setCategories(response.data.data)
      } else {
        toast.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async (category: Category) => {
    try {
      const formData = new FormData()
      formData.append('name', category.name)
      formData.append('displayOrder', category.displayOrder.toString())
      formData.append('hidden', category.hidden.toString())
      formData.append('branchId', "6829cec57032455faec894ab")

      // Add availability data
      Object.entries(category.availability).forEach(([day, value]) => {
        formData.append(`availability[${day}]`, value)
      })

      // Add printers
      category.printers.forEach(printer => {
        formData.append('printers', printer)
      })

      // Add image if exists
      if (category.imageUrl) {
        formData.append('image', category.imageUrl)
      }

      const response = await axios.post(
        'http://localhost:5000/api/categories',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data.success) {
        // Instead of making a new API call, directly add the category to state
        setCategories(prevCategories => [...prevCategories, category])
        setIsAddModalOpen(false)
        toast.success('Category added successfully')
      } else {
        throw new Error('Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Failed to add category')
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/categories/${categoryId}`)
      
      if (response.data.success) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId))
        toast.success('Category deleted successfully')
      } else {
        throw new Error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      const formData = new FormData()
      formData.append('name', updatedCategory.name)
      formData.append('displayOrder', updatedCategory.displayOrder.toString())
      formData.append('hidden', updatedCategory.hidden.toString())
      formData.append('branchId', "6829cec57032455faec894ab")

      Object.entries(updatedCategory.availability).forEach(([day, value]) => {
        formData.append(`availability[${day}]`, value)
      })

      updatedCategory.printers.forEach(printer => {
        formData.append('printers', printer)
      })

      if (updatedCategory.imageUrl) {
        formData.append('image', updatedCategory.imageUrl)
      }

      const response = await axios.put(
        `http://localhost:5000/api/categories/${updatedCategory.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data.success) {
        setCategories(prev => 
          prev.map(cat => cat.id === updatedCategory.id ? 
            { ...response.data.data, items: updatedCategory.items } : cat
          )
        )
        toast.success('Category updated successfully')
      } else {
        throw new Error('Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <Eye className="h-5 w-5 mr-1" />
            View Your Store
          </button>
        </div>
      </header>
      
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
          onSuccess={fetchCategories}
        />

        <AttributeTypesModal
          open={isAttributeTypesModalOpen}
          onClose={() => setIsAttributeTypesModalOpen(false)}
        />
      </div>
    </PageLayout>
  )
} 