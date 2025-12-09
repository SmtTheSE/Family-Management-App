import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function Diagnostics() {
  const [diagnostics, setDiagnostics] = useState({
    supabaseUrl: '',
    supabaseAnonKey: '',
    clientInitialized: false,
    error: ''
  });

  useEffect(() => {
    try {
      // Check if environment variables are available
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'NOT FOUND';
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'NOT FOUND';
      
      // Check if Supabase client is properly initialized
      const clientInitialized = !!supabase;
      
      setDiagnostics({
        supabaseUrl,
        supabaseAnonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'NOT FOUND',
        clientInitialized,
        error: ''
      });
      
      // Try a simple Supabase request to test connectivity
      supabase.rpc('now').then(result => {
        console.log('Supabase connection test:', result);
      }).catch(error => {
        console.error('Supabase connection error:', error);
      });
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Diagnostics</h1>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">VITE_SUPABASE_URL:</span>
              <div className="font-mono text-sm break-all bg-gray-100 p-2 rounded mt-1">
                {diagnostics.supabaseUrl}
              </div>
            </div>
            <div>
              <span className="font-medium">VITE_SUPABASE_ANON_KEY:</span>
              <div className="font-mono text-sm break-all bg-gray-100 p-2 rounded mt-1">
                {diagnostics.supabaseAnonKey}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Supabase Client</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Client Initialized:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                diagnostics.clientInitialized 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {diagnostics.clientInitialized ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
        
        {diagnostics.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <div className="font-mono text-sm break-all text-red-700">
              {diagnostics.error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}