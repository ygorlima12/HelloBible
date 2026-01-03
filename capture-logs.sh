#!/bin/bash

echo "📋 Capturando logs detalhados do React Native"
echo "=============================================="
echo ""
echo "Este script vai:"
echo "  1. Limpar logs antigos do Android"
echo "  2. Capturar logs em tempo real"
echo "  3. Salvar em um arquivo para análise"
echo ""

# Nome do arquivo de log com timestamp
LOG_FILE="error-logs-$(date +%Y%m%d-%H%M%S).txt"

echo "Iniciando captura de logs..."
echo "Logs serão salvos em: $LOG_FILE"
echo ""
echo "⚠️  INSTRUÇÕES:"
echo "  1. Este terminal vai mostrar os logs em tempo real"
echo "  2. Deixe este script rodando"
echo "  3. Em OUTRO terminal, execute: npm run android"
echo "  4. Quando o erro aparecer, pressione Ctrl+C aqui"
echo "  5. Analise o arquivo $LOG_FILE"
echo ""
echo "Pressione Enter para começar..."
read

# Limpar logs antigos
adb logcat -c

# Capturar logs com filtros relevantes
echo "🔍 Capturando logs (pressione Ctrl+C para parar)..."
echo ""

adb logcat \
  ReactNative:V \
  ReactNativeJS:V \
  AndroidRuntime:E \
  *:E \
  | tee "$LOG_FILE"

echo ""
echo "✅ Logs salvos em: $LOG_FILE"
echo ""
echo "Para ver apenas erros, execute:"
echo "  grep -i error $LOG_FILE"
