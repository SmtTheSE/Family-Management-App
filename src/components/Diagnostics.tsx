import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function Diagnostics() {
  const [diagnostics, setDiagnostics] = useState({
    supabaseUrl: '',
    supabaseAnonKey: '',
    clientInitialized: false,
    error: '',
    authStatus: 'unknown',
    authError: null as any
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
        error: '',
        authStatus: 'checking',
        authError: null
      });
      
      // Log the Supabase client to verify it's properly initialized
      console.log('Supabase client:', supabase);
      
      // Test authentication
      testAuth();
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, []);

  const testAuth = async () => {
    try {
      setDiagnostics(prev => ({ ...prev, authStatus: 'testing' }));
      
      // Try to get the current session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setDiagnostics(prev => ({ 
          ...prev, 
          authStatus: 'error', 
          authError: error 
        }));
        return;
      }
      
      setDiagnostics(prev => ({ 
        ...prev, 
        authStatus: data.session ? 'authenticated' : 'unauthenticated',
        authError: null
      }));
    } catch (error) {
      setDiagnostics(prev => ({ 
        ...prev, 
        authStatus: 'error', 
        authError: error 
      }));
    }
  };

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
            <div>
              <span className="font-medium">Auth Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                diagnostics.authStatus === 'authenticated' ? 'bg-green-100 text-green-800' :
                diagnostics.authStatus === 'unauthenticated' ? 'bg-yellow-100 text-yellow-800' :
                diagnostics.authStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {diagnostics.authStatus}
              </span>
            </div>
            
            {diagnostics.authError && (
              <div className="mt-2">
                <span className="font-medium">Auth Error:</span>
                <div className="font-mono text-sm break-all bg-red-50 p-2 rounded mt-1 text-red-700">
                  {JSON.stringify(diagnostics.authError, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>If environment variables show "NOT FOUND", they are not properly configured in your deployment</li>
            <li>If client is not initialized, there's an issue with the Supabase client setup</li>
            <li>If auth status is "error", check the auth error details above</li>
            <li>Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment</li>
          </ol>
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