import React, { useState } from 'react';
import { X, Hash, Lock } from 'lucide-react';
import { useMailStore } from '../../stores/mailStore';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose }) => {
  const { createChannel, error, clearError } = useMailStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'general',
    isPrivate: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const channelTypes = [
    { value: 'general', label: 'General', description: 'Para conversaciones generales del equipo' },
    { value: 'project', label: 'Proyecto', description: 'Para discusiones específicas de proyectos' },
    { value: 'department', label: 'Departamento', description: 'Para comunicación departamental' },
    { value: 'announcement', label: 'Anuncios', description: 'Para comunicados importantes' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      await createChannel({
        name: formData.name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: formData.description.trim() || undefined,
        type: formData.type,
        isPrivate: formData.isPrivate
      });
      
      // Reset form and close modal
      setFormData({ name: '', description: '', type: 'general', isPrivate: false });
      onClose();
    } catch (error) {
      console.error('Create channel error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', description: '', type: 'general', isPrivate: false });
      clearError();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Crear nuevo canal
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Channel name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del canal *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej: marketing-equipo"
                  required
                  disabled={isSubmitting}
                  maxLength={50}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Los nombres de canal deben estar en minúsculas, sin espacios. Se permiten guiones.
              </p>
            </div>

            {/* Channel description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="¿De qué trata este canal?"
                rows={3}
                disabled={isSubmitting}
                maxLength={250}
              />
            </div>

            {/* Channel type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de canal
              </label>
              <div className="space-y-2">
                {channelTypes.map((type) => (
                  <label key={type.value} className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={isSubmitting}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy setting */}
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <div className="flex items-center">
                  <Lock className="w-4 h-4 text-gray-500 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Canal privado</div>
                    <div className="text-xs text-gray-500">Solo los miembros invitados pueden ver y unirse</div>
                  </div>
                </div>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !formData.name.trim()}
              >
                {isSubmitting ? 'Creando...' : 'Crear canal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;