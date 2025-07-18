// Debug script for production deployment
// Run this in your browser console on the production site

console.log('🚀 ForvaraHub Production Debug Script');

// 1. Check if basic scripts are loaded
console.log('🔍 Checking JavaScript bundles...');
const scripts = Array.from(document.querySelectorAll('script[src]'));
console.log('Scripts loaded:', scripts.map(s => s.src));

// 2. Check if CSS is loaded
console.log('🎨 Checking CSS bundles...');
const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
console.log('Stylesheets loaded:', stylesheets.map(s => s.href));

// 3. Check if React is mounted
console.log('⚛️ Checking React mount...');
const root = document.getElementById('root');
console.log('Root element:', root);
console.log('Root has content:', root && root.innerHTML.length > 0);

// 4. Check for common errors
console.log('🔧 Checking for common issues...');
console.log('Window errors:', window.onerror ? 'Error handler exists' : 'No error handler');

// 5. Test API connectivity
console.log('🌐 Testing API connectivity...');
const apiUrl = window.location.origin.includes('localhost') 
  ? 'http://localhost:4000/api' 
  : 'https://api.forvara.dev/api';

fetch(`${apiUrl}/health`)
  .then(res => {
    console.log('✅ API Response status:', res.status);
    return res.json();
  })
  .then(data => console.log('✅ API Health data:', data))
  .catch(err => console.error('❌ API Health failed:', err));

// 6. Check localStorage
console.log('💾 Checking localStorage...');
try {
  const authStorage = localStorage.getItem('auth-storage');
  console.log('Auth storage exists:', !!authStorage);
  if (authStorage) {
    const parsed = JSON.parse(authStorage);
    console.log('Auth storage data:', {
      hasUser: !!parsed.state?.user,
      hasToken: !!parsed.state?.token,
      companiesCount: parsed.state?.companies?.length || 0
    });
  }
} catch (err) {
  console.error('❌ localStorage error:', err);
}

// 7. Check for Zustand store
console.log('🏪 Checking Zustand store...');
setTimeout(() => {
  try {
    // Try to access the store through window (if it's available)
    if (window.zustand) {
      console.log('✅ Zustand store available');
    } else {
      console.log('⚠️ Zustand store not found on window');
    }
  } catch (err) {
    console.error('❌ Zustand store error:', err);
  }
}, 1000);

// 8. Check React Router
console.log('🛣️ Checking React Router...');
console.log('Current pathname:', window.location.pathname);
console.log('Current search:', window.location.search);

// 9. Monitor for runtime errors
console.log('👀 Setting up error monitoring...');
window.addEventListener('error', (e) => {
  console.error('🚨 Runtime error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('🚨 Unhandled promise rejection:', e.reason);
});

console.log('✅ Production debug script loaded. Check console for results.');