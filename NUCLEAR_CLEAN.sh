#!/bin/bash

echo "☢️  HelloBible - LIMPEZA NUCLEAR (Opção mais agressiva)"
echo "======================================================="
echo ""
echo "⚠️  ATENÇÃO: Isso vai:"
echo "   - Matar todos os processos React Native"
echo "   - Limpar TODOS os caches"
echo "   - Desinstalar o app do emulador"
echo "   - Limpar cache do Android Build"
echo ""
read -p "Continuar? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]
then
    exit 1
fi

echo ""
echo "🔪 PASSO 1: Matando TODOS os processos..."
# Matar Metro bundler
pkill -9 node 2>/dev/null || true
pkill -9 react-native 2>/dev/null || true
# Matar processos na porta 8081
kill -9 $(lsof -t -i:8081) 2>/dev/null || true
echo "   ✓ Processos terminados"
echo ""

echo "🗑️  PASSO 2: Removendo app do emulador..."
adb uninstall com.hellobible 2>/dev/null || echo "   App não estava instalado"
echo "   ✓ App desinstalado"
echo ""

echo "🧹 PASSO 3: Limpando TODOS os caches Android..."
cd android
rm -rf .gradle
rm -rf build
rm -rf app/build
rm -rf app/.cxx
cd ..
echo "   ✓ Caches Android removidos"
echo ""

echo "🧹 PASSO 4: Limpando node_modules e caches Node..."
rm -rf node_modules
rm -rf package-lock.json
npm cache clean --force
echo "   ✓ Node limpo"
echo ""

echo "🧹 PASSO 5: Limpando caches Metro e React Native..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf ~/.metro-cache 2>/dev/null || true
watchman watch-del-all 2>/dev/null || echo "   Watchman não disponível"
echo "   ✓ Caches Metro removidos"
echo ""

echo "📦 PASSO 6: Reinstalando dependências..."
npm install
echo "   ✓ Dependências instaladas"
echo ""

echo "🏗️  PASSO 7: Fazendo build COMPLETO do Android..."
cd android
./gradlew clean
cd ..
echo "   ✓ Build limpo"
echo ""

echo ""
echo "✅ LIMPEZA NUCLEAR COMPLETA!"
echo ""
echo "═══════════════════════════════════════════════"
echo "AGORA EXECUTE OS SEGUINTES COMANDOS:"
echo "═══════════════════════════════════════════════"
echo ""
echo "Terminal 1 (Metro bundler):"
echo "  npx react-native start --reset-cache"
echo ""
echo "Aguarde o Metro iniciar completamente, depois:"
echo ""
echo "Terminal 2 (Build e Install):"
echo "  npm run android"
echo ""
echo "═══════════════════════════════════════════════"
echo ""
