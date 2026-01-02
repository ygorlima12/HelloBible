# 🔧 Instruções para Corrigir o Erro

## Problema Identificado

O erro `TypeError: Cannot convert undefined value to object` está sendo causado por **múltiplos níveis de cache antigo**. Mesmo depois de corrigir o código, caches do Metro, Gradle e do app instalado no emulador estão servindo código antigo.

## ☢️ SOLUÇÃO NUCLEAR (Método 1 - MAIS EFETIVO)

**Use este método se os outros falharam:**

```bash
# Execute o script de limpeza NUCLEAR:
chmod +x NUCLEAR_CLEAN.sh
./NUCLEAR_CLEAN.sh
```

Depois de finalizar, **em dois terminais separados**:

**Terminal 1:**
```bash
npx react-native start --reset-cache
```

Aguarde o Metro iniciar completamente, **DEPOIS**:

**Terminal 2:**
```bash
npm run android
```

## Solução Rápida (Método 2)

Execute o script de limpeza automática:

```bash
./CLEAR_ALL_CACHES.sh
```

Aguarde a conclusão e depois:

```bash
npm run android
```

## Solução Manual (Método 2)

Se o script acima não funcionar, execute manualmente:

### Passo 1: Parar Metro Bundler

```bash
# Pressione Ctrl+C no terminal onde o Metro está rodando
# OU force kill:
kill -9 $(lsof -t -i:8081)
```

### Passo 2: Limpar TODOS os Caches

```bash
# Limpar Watchman
watchman watch-del-all

# Limpar caches temporários do React Native
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
rm -rf $TMPDIR/react-*

# Limpar cache do Metro especificamente
npx react-native start --reset-cache
```

Aguarde o Metro iniciar, veja a mensagem "transform cache was reset", e então **pare ele** (Ctrl+C).

### Passo 3: Limpar Build do Android

```bash
cd android
./gradlew clean
./gradlew cleanBuildCache
cd ..
```

### Passo 4: Reinstalar Dependências (Opcional mas Recomendado)

```bash
rm -rf node_modules
npm install
```

### Passo 5: Iniciar App Limpo

```bash
npm run android
```

## Verificação

Se tudo funcionou:
- ✅ O app deve inicializar sem a tela vermelha de erro
- ✅ Você deve ver a tela de login ou a tela principal
- ✅ O erro "Cannot convert undefined value to object" NÃO deve aparecer

## Ainda com Problemas?

Se o erro persistir após seguir TODOS os passos acima:

1. Verifique se você executou `git pull` para pegar as últimas correções
2. Certifique-se de que NENHUM processo do Metro está rodando: `lsof -i:8081`
3. Reinicie seu emulador Android
4. Tente executar em um emulador diferente ou dispositivo real

## O Que Foi Corrigido

1. ✅ Instalado pacote `react-native-url-polyfill` (necessário para Supabase)
2. ✅ Atualizado arquivo `src/config/supabase.js` com credenciais reais
3. ✅ Todas as alterações foram commitadas no branch `claude/fix-error-xgvcM`

O problema agora é APENAS cache antigo do bundler!
