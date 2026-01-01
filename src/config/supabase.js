import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

// IMPORTANTE: Substitua com suas credenciais do Supabase
// 1. Acesse https://app.supabase.com
// 2. Crie um novo projeto
// 3. Vá em Settings > API
// 4. Copie a URL e a anon key

const SUPABASE_URL = 'https://seu-projeto.supabase.co'; // Substitua pela URL do seu projeto
const SUPABASE_ANON_KEY = 'sua-anon-key-aqui'; // Substitua pela sua anon key

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
