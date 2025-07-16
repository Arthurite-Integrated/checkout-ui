import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import server from '../server';
import { Toast } from '../utils/Toast';
import { useQueryClient } from '@tanstack/react-query';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div
        className={`
          relative w-full mx-4 
          ${sizeClasses[size]}
          bg-[#2a2b2b] 
          border border-gray-700 
          rounded-2xl 
          shadow-2xl 
          transform transition-all duration-300 
          animate-in fade-in-0 zoom-in-95
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          {title && (
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          )}
          {!title && <div />} {/* Spacer when no title */}
          
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-700 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export function DeleteProductModal({isModalOpen, setIsModalOpen, productId, business_id, editingProduct, cancelEdit}:{isModalOpen: boolean, setIsModalOpen: (isOpen: boolean) => void, productId: string, business_id: string, editingProduct: any, cancelEdit: () => void}) {
  const queryClient = useQueryClient();
  async function deleteProduct(productId: string, business_id: string) {

    if (!productId || !business_id) return Toast("Invalid product or business ID", true);

    console.log(productId, business_id)
    try {
      const {code, message, status, data } = await server.deleteProduct(productId, business_id);
      console.log(message, code, status, data);
      
      if (status !== 'OK') {
        Toast(message, true);
        return;
      }
      
      Toast(message, false);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      
      // If we're editing this product, cancel edit mode
      if (editingProduct && editingProduct.id === productId) {
        cancelEdit();
      }
    } catch (error) {
      Toast("Failed to delete product", true);
    } finally {
      setIsModalOpen(false);
    }
  };
  
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Confirm Delete"
      size="sm"
    >
    <div className="space-y-4">
      <p className="text-gray-300">Are you sure you want to delete this item?</p>
      <div className="flex space-x-4">
        <button
          onClick={() => deleteProduct(productId, business_id)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
        <button
          onClick={() => 0}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
  )
}

export default Modal;