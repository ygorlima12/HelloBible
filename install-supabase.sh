#!/bin/bash

echo "🚀 Instalando dependências do Supabase para React Native..."

# Instalar Supabase e polyfills necessários
npm install @supabase/supabase-js react-native-url-polyfill

echo "✅ Dependências instaladas!"
echo ""
echo "Agora execute:"
echo "  npx react-native start --reset-cache"
echo ""
echo "Em outro terminal:"
echo "  npm run android"
