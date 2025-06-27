import { Shield } from 'lucide-react'
import Header from './components/Header'

function App() {
  // Mock data para testing
  const mockUser = {
    nombre: 'Alex',
    apellido: 'Rodriguez'
  }
  
  const mockTenant = {
    nombre: 'Mi Empresa Demo'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={mockUser} currentTenant={mockTenant} />
      
      {/* Main Content Area */}
      <main className="p-6">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-text mb-4">Bienvenido a Forvara</h1>
          <p className="text-accent text-lg mb-8">Tu hub empresarial sin abuso de precios</p>
          
          {/* App Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {['Elaris ERP', 'Forvara Mail', 'Analytics'].map((app) => (
              <div key={app} className="bg-surface border border-secondary/20 rounded-xl p-6 hover:border-accent/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-text font-semibold mb-2">{app}</h3>
                <p className="text-accent text-sm mb-4">Aplicación empresarial</p>
                <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                  Abrir
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
