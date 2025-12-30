# 🔧 Guia de Solução de Problemas - Build Android

## ❌ Erro: react-native-worklets library not found

### ✅ Solução Implementada

A dependência `react-native-worklets` já foi adicionada ao `package.json` e commitada.

### 🛠️ Passos para Resolver no Seu Ambiente

#### 1. Sincronize com o repositório
```bash
git pull origin claude/update-app-design-colors-koJtz
```

#### 2. Reinstale as dependências
```bash
# Remover node_modules e reinstalar
rm -rf node_modules
npm install
```

#### 3. Limpar cache do React Native
```bash
# Limpar cache do Metro Bundler
npx react-native start --reset-cache
```

#### 4. Limpar build do Android
```bash
cd android
./gradlew clean
cd ..
```

#### 5. Limpar cache do Gradle (opcional)
```bash
cd android
rm -rf .gradle
./gradlew clean
cd ..
```

#### 6. Executar novamente
```bash
npm run android
```

### 🚨 Problemas de Rede

Se você estiver enfrentando problemas de rede ao baixar o Gradle:

```bash
# Configure um proxy se necessário
export GRADLE_OPTS="-Dhttp.proxyHost=seu-proxy -Dhttp.proxyPort=porta"

# Ou desabilite verificações SSL (não recomendado para produção)
cd android
echo "org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8" >> gradle.properties
```

### 📦 Verificar Instalação das Dependências

Certifique-se de que estas dependências estão instaladas:

```json
"react-native-reanimated": "^4.2.1",
"react-native-worklets": "^0.7.1",
"react-native-linear-gradient": "^2.8.3",
"@react-navigation/bottom-tabs": "^7.9.0"
```

### 🔄 Processo Completo de Limpeza

Se nada funcionar, tente este processo completo:

```bash
# 1. Parar qualquer processo do Metro
killall node

# 2. Limpar tudo
rm -rf node_modules
rm -rf android/.gradle
rm -rf android/app/build
rm -rf ios/build
rm -rf ~/Library/Caches/CocoaPods (macOS apenas)

# 3. Reinstalar
npm install

# 4. iOS apenas (macOS)
cd ios
pod deintegrate
pod install
cd ..

# 5. Executar
npm run android
# ou
npm run ios
```

### 📱 Configuração do Android Studio

Se você usa Android Studio, tente:

1. **File → Invalidate Caches / Restart**
2. **Build → Clean Project**
3. **Build → Rebuild Project**

### ⚠️ Versões Importantes

Certifique-se de ter:
- Node.js >= 20
- JDK 17 ou 21 (para React Native 0.83)
- Android SDK Platform 36
- Gradle 9.0.0

### 🐛 Debugging

Se o erro persistir, execute com mais detalhes:

```bash
# Android
cd android
./gradlew app:installDebug --stacktrace --info
cd ..

# Ou com React Native CLI
npx react-native run-android --verbose
```

### 📞 Suporte

Se o problema continuar:

1. Verifique a versão do Java:
   ```bash
   java -version
   # Deve ser 17 ou 21
   ```

2. Verifique as variáveis de ambiente:
   ```bash
   echo $ANDROID_HOME
   echo $JAVA_HOME
   ```

3. Execute o doctor do React Native:
   ```bash
   npx react-native doctor
   ```

### ✅ Checklist Final

- [ ] Node modules reinstalados
- [ ] Cache do Metro limpo
- [ ] Build do Android limpo
- [ ] Gradle sincronizado
- [ ] Metro Bundler rodando
- [ ] Dispositivo/Emulador conectado

---

**💡 Dica**: Execute `npx react-native doctor` para verificar automaticamente seu ambiente de desenvolvimento.
