# Configuração do Supabase para HelloBible

Este guia explica como configurar o Supabase para o app HelloBible.

## 📋 Pré-requisitos

- Conta no [Supabase](https://app.supabase.com)
- Node.js instalado
- React Native configurado

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha os dados:
   - **Name**: HelloBible
   - **Database Password**: Crie uma senha forte (guarde bem!)
   - **Region**: Escolha a região mais próxima (ex: South America)
5. Clique em **"Create new project"**
6. Aguarde alguns minutos enquanto o projeto é criado

## 🔑 Passo 2: Obter Credenciais

1. No painel do projeto, vá em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie as seguintes informações:
   - **Project URL** (será algo como `https://xxxxx.supabase.co`)
   - **anon public** key (a chave pública)

## ⚙️ Passo 3: Configurar o App

1. Abra o arquivo `/src/config/supabase.js`
2. Substitua as credenciais:

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co'; // Cole sua URL aqui
const SUPABASE_ANON_KEY = 'sua-anon-key-aqui'; // Cole sua anon key aqui
```

## 🗄️ Passo 4: Criar Banco de Dados

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Abra o arquivo `/supabase_schema.sql` do projeto
4. Copie todo o conteúdo do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **"Run"** (ou pressione Ctrl+Enter)
7. Aguarde a execução - você deve ver "Success. No rows returned"

## ✅ Passo 5: Verificar Instalação

1. No painel do Supabase, vá em **Table Editor**
2. Você deve ver as seguintes tabelas:
   - `user_profiles`
   - `user_stats`
   - `user_progress`
   - `user_achievements`
   - `sermons`

## 🔐 Passo 6: Configurar Autenticação

1. Vá em **Authentication** > **Settings**
2. Em **Email Auth**:
   - ✅ Habilite "Enable email confirmations" (opcional - desabilite para desenvolvimento)
   - Configure "Site URL" se necessário
3. Em **Auth Providers**:
   - Email está habilitado por padrão ✅

## 🧪 Passo 7: Testar

1. Inicie o app: `npm start` ou `npm run android`
2. Registre um novo usuário no app
3. No painel do Supabase:
   - Vá em **Authentication** > **Users**
   - Você deve ver o usuário criado
   - Vá em **Table Editor** > **user_profiles**
   - Você deve ver o perfil criado automaticamente
   - Vá em **user_stats**
   - Você deve ver as estatísticas iniciais

## 📊 O Que Foi Criado

### Tabelas

**user_profiles**
- Perfil estendido do usuário
- Nome, avatar
- Criado automaticamente via trigger

**user_stats**
- Estatísticas de gamificação
- XP, nível, streak, lições completas
- Criado automaticamente para novos usuários

**user_progress**
- Progresso do usuário nas lições
- Módulo, lição, cards completados, pontuação

**user_achievements**
- Conquistas desbloqueadas
- ID da conquista, data de desbloqueio

**sermons**
- Sermões salvos pelo usuário
- Tema, ideia, conteúdo gerado

### Segurança (RLS - Row Level Security)

Todas as tabelas têm políticas de segurança:
- ✅ Usuários só podem ver/editar seus próprios dados
- ✅ Proteção contra acesso não autorizado
- ✅ Queries automáticas consideram o usuário logado

### Triggers Automáticos

**on_auth_user_created**
- Quando um usuário se registra
- Cria automaticamente:
  - Perfil em `user_profiles`
  - Estatísticas iniciais em `user_stats`

**handle_updated_at**
- Atualiza campo `updated_at` automaticamente
- Funciona em todas as tabelas

## 🔧 Desenvolvimento vs Produção

### Desenvolvimento (atual)

- Email confirmations: **Desabilitadas** (mais rápido para testar)
- Senhas mínimas: 6 caracteres

### Produção (quando publicar)

1. **Habilite email confirmations**:
   - Authentication > Settings > Enable email confirmations
   - Configure SMTP ou use Supabase email

2. **Configure domínio**:
   - Settings > API > Site URL
   - Adicione a URL do seu app

3. **Habilite 2FA** (opcional):
   - Para usuários sensíveis

4. **Configure rate limiting**:
   - Protege contra ataques de força bruta

## 📱 Funcionalidades do App com Supabase

### ✅ Implementadas

- [x] Autenticação segura (email/senha)
- [x] Registro de usuários
- [x] Login/Logout
- [x] Perfis de usuário
- [x] Persistência de sessão

### 🔄 Próximas (em implementação)

- [ ] Sincronização de progresso nas lições
- [ ] Sincronização de estatísticas (XP, nível, streak)
- [ ] Sincronização de conquistas
- [ ] Sincronização de sermões salvos
- [ ] Backup automático na nuvem

## 🐛 Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou a anon key corretamente
- Certifique-se de não copiar espaços extras

### Erro: "Failed to create user"
- Verifique se o schema SQL foi executado corretamente
- Verifique se os triggers foram criados

### Erro: "Row Level Security"
- As políticas RLS estão ativas
- Certifique-se de estar autenticado

### Tabelas não aparecem
- Execute o schema SQL novamente
- Verifique logs no SQL Editor

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [React Native Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no console do app
2. Verifique os logs no painel do Supabase (Database > Logs)
3. Consulte a documentação oficial
4. Abra uma issue no repositório do projeto
