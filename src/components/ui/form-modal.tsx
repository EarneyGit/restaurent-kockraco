"use client"

import { ReactNode, FormEvent } from "react"
import Modal from "./modal"

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSubmit: (e: FormEvent) => void
  submitText?: string
  cancelText?: string
  maxWidth?: string
  maxHeight?: string
  isSubmitDisabled?: boolean
}

function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  maxWidth,
  maxHeight,
  isSubmitDisabled = false
}: FormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
    >
      <form onSubmit={onSubmit}>
        {children}
        
        <div className="flex justify-end space-x-4 mt-8 border-t pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          >
            {submitText}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FormModal 