#!/bin/bash

echo "🧹 HelloBible - Limpeza Completa de Caches"
echo "=========================================="
echo ""

# Parar Metro bundler
echo "1️⃣ Parando Metro bundler..."
kill -9 $(lsof -t -i:8081) 2>/dev/null || echo "   Metro não estava rodando"
echo "   ✓ Metro parado"
echo ""

# Limpar cache do Watchman
echo "2️⃣ Limpando Watchman..."
watchman watch-del-all 2>/dev/null || echo "   Watchman não disponível (OK)"
echo "   ✓ Watchman limpo"
echo ""

# Limpar node_modules e reinstalar
echo "3️⃣ Limpando node_modules..."
rm -rf node_modules
echo "   ✓ node_modules removido"
echo ""

echo "4️⃣ Limpando caches npm/yarn..."
npm cache clean --force
echo "   ✓ Cache npm limpo"
echo ""

echo "5️⃣ Reinstalando dependências..."
npm install
echo "   ✓ Dependências instaladas"
echo ""

# Limpar cache do Metro
echo "6️⃣ Limpando cache do Metro..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
echo "   ✓ Cache do Metro limpo"
echo ""

# Limpar cache do Android
echo "7️⃣ Limpando cache do Gradle (Android)..."
cd android
./gradlew clean
./gradlew cleanBuildCache
cd ..
echo "   ✓ Cache do Gradle limpo"
echo ""

# Limpar cache do React Native
echo "8️⃣ Limpando cache geral do React Native..."
npx react-native start --reset-cache &
METRO_PID=$!
sleep 5
kill $METRO_PID 2>/dev/null
echo "   ✓ Cache do React Native resetado"
echo ""

echo "✅ Limpeza completa finalizada!"
echo ""
echo "Próximos passos:"
echo "1. Execute: npm run android"
echo "2. O app deve iniciar sem erros"
echo ""
