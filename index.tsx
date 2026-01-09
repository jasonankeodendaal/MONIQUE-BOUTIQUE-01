import React, { Component, ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#0f172a', 
          color: 'white', 
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>The application encountered a critical error during initialization.</p>
          
          <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', maxWidth: '600px', overflowX: 'auto', textAlign: 'left', border: '1px solid #334155' }}>
            <code style={{ color: '#f87171' }}>{this.state.error?.toString()}</code>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: 'transparent', 
                border: '1px solid #475569', 
                color: 'white', 
                borderRadius: '0.5rem', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Reload Page
            </button>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }} 
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: '#D4AF37', 
                border: 'none', 
                color: '#1e293b', 
                borderRadius: '0.5rem', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Clear Cache & Reset
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);