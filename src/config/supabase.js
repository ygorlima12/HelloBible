import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

// IMPORTANTE: Substitua com suas credenciais do Supabase
// 1. Acesse https://app.supabase.com
// 2. Crie um novo projeto
// 3. Vá em Settings > API
// 4. Copie a URL e a anon key

const SUPABASE_URL = 'https://ewhdexsrsdbawjutheat.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aGRleHNyc2RiYXdqdXRoZWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDM2NDcsImV4cCI6MjA4Mjg3OTY0N30.xUambhyHJNywrxRLwwXAk3Y7MKm9508A3pK0rcGnxqI';

// Configuração do cliente Supabase para React Native
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    // Desabilitar realtime para evitar problemas de compatibilidade
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-react-native',
    },
  },
});

export default supabaseClient;
