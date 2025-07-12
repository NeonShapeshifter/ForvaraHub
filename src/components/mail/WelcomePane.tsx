import React from 'react';
import { MessageCircle, Hash, Users, Zap, Lock } from 'lucide-react';
import { useMailStore } from '../../stores/mailStore';
import { useTenantStore } from '../../stores/tenantStore';

const WelcomePane: React.FC = () => {
  const { channels, selectChannel } = useMailStore();
  const { currentTenant } = useTenantStore();

  const recentChannels = channels.slice(0, 3);

  return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="max-w-2xl mx-auto p-8 text-center">
        {/* Welcome header */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            ¡Bienvenido a ForvaraMail!
          </h1>
          <p className="text-lg text-gray-600">
            Comunicación empresarial moderna para {currentTenant?.nombre || 'tu empresa'}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <Hash className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Canales organizados</h3>
            <p className="text-sm text-gray-600">
              Mantén las conversaciones organizadas por proyectos y departamentos
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Colaboración fluida</h3>
            <p className="text-sm text-gray-600">
              Comparte archivos, menciona colegas y mantente conectado
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Tiempo real</h3>
            <p className="text-sm text-gray-600">
              Mensajes instantáneos con notificaciones y estado de lectura
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Comienza a conversar
          </h2>
          
          {recentChannels.length > 0 ? (
            <div className="space-y-3">
              <p className="text-gray-600 mb-4">
                Únete a estos canales populares:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {recentChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => selectChannel(channel.id)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {channel.is_private ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Hash className="w-4 h-4" />
                    )}
                    <span>#{channel.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              <p className="mb-4">Aún no hay canales disponibles.</p>
              <button
                onClick={() => alert('Crear canal próximamente')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Hash className="w-5 h-5" />
                <span>Crear tu primer canal</span>
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">💡 Consejos para empezar</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Usa @usuario para mencionar a alguien</li>
            <li>• Arrastra archivos para compartirlos</li>
            <li>• Presiona Shift+Enter para nueva línea</li>
            <li>• Reacciona con emojis para respuestas rápidas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WelcomePane;