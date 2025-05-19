"use client"

import { useState } from "react"
import Modal from "../ui/modal"
import FormModal from "../ui/form-modal"

function ModalExample() {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setIsFormModalOpen(false)
  }

  const isFormValid = formData.name && formData.email

  return (
    <div className="p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Modal Components Examples</h1>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setIsBasicModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Open Basic Modal
          </button>
          
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Open Form Modal
          </button>
        </div>
      </div>
      
      {/* Basic Modal Example */}
      <Modal
        isOpen={isBasicModalOpen}
        onClose={() => setIsBasicModalOpen(false)}
        title="Basic Modal Example"
      >
        <div className="space-y-4">
          <p>This is a basic modal that can contain any content.</p>
          <p>It has a title, close button, and content area.</p>
          
          <div className="flex justify-end">
            <button
              onClick={() => setIsBasicModalOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Close Modal
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Form Modal Example */}
      <FormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        title="Form Modal Example"
        isSubmitDisabled={!isFormValid}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2">
              <span className="text-red-500">*</span> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">
              <span className="text-red-500">*</span> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <p className="text-sm text-gray-500">
            This modal uses the FormModal component which extends the base Modal
            with form functionality including submit and cancel buttons.
          </p>
        </div>
      </FormModal>
    </div>
  )
}

export default ModalExample 