# 🤖 Configuração da OpenAI API

## 📋 Visão Geral

O app HelloBible agora está integrado com a API da OpenAI para fornecer um assistente teológico inteligente que pode:

- ✅ Responder perguntas sobre a Bíblia
- ✅ Fornecer contexto histórico e cultural
- ✅ Analisar versículos em profundidade
- ✅ Ajudar na preparação de sermões
- ✅ Explicar conceitos teológicos
- ✅ Sugerir versículos relacionados

## 🔑 Como Obter sua Chave de API

### Passo 1: Criar Conta na OpenAI

1. Acesse: [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Crie uma conta ou faça login se já tiver uma

### Passo 2: Gerar Chave de API

1. Acesse: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Clique em **"Create new secret key"**
3. Dê um nome para sua chave (ex: "HelloBible App")
4. **IMPORTANTE**: Copie a chave imediatamente - você não poderá vê-la novamente!

### Passo 3: Configurar no App

#### Opção 1: Pelo Chat (Recomendado)

1. Abra o app HelloBible
2. Toque no botão flutuante do chat (ícone de robô)
3. Toque no ícone de **engrenagem** (⚙️) no header
4. Cole sua chave de API no campo
5. Toque em **"Testar Chave"** para validar
6. Toque em **"Salvar"**

#### Opção 2: Pela Tela de Perfil

1. Vá para a aba **Perfil**
2. Toque em **"Configurações"**
3. Toque em **"Configurar OpenAI"**
4. Cole sua chave de API
5. Salve

## 💰 Custos da API

### Modelo Usado: GPT-3.5-turbo

- **Custo**: ~$0.002 por 1.000 tokens
- **Média**: Uma conversa típica usa 500-1000 tokens
- **Exemplo**: 100 perguntas = ~$0.10 - $0.20

### Como Controlar Custos

1. **Monitore seu uso**: [https://platform.openai.com/usage](https://platform.openai.com/usage)
2. **Configure limites**: [https://platform.openai.com/account/billing/limits](https://platform.openai.com/account/billing/limits)
3. **Créditos gratuitos**: Novas contas recebem $5 em créditos gratuitos

## 🔒 Segurança

### ✅ Boas Práticas

- ✅ Sua chave é armazenada **localmente** no dispositivo
- ✅ Use AsyncStorage criptografado
- ✅ Nunca compartilhe sua chave de API
- ✅ Revogue chaves antigas que não usa mais

### ⚠️ NUNCA Faça Isso

- ❌ Commitar chaves no Git
- ❌ Compartilhar chaves em redes sociais
- ❌ Usar a mesma chave em múltiplos apps públicos
- ❌ Deixar a chave em código fonte

## 🎯 Funcionalidades Implementadas

### 1. Chat Teológico Inteligente

O assistente usa um **system prompt** especializado em teologia:

```javascript
"Você é um assistente teológico especializado em estudos bíblicos.
Suas responsabilidades:
- Responder perguntas sobre a Bíblia com precisão
- Fornecer contexto histórico e cultural
- Citar versículos e referências apropriadas
- Explicar conceitos teológicos de forma clara"
```

### 2. Análise de Versículos

```javascript
await OpenAIService.analyzeVerse(
  "Porque Deus amou o mundo de tal maneira...",
  "João 3:16"
);
```

Retorna:
- Contexto histórico
- Significado das palavras no original
- Interpretação teológica
- Aplicação prática
- Versículos relacionados

### 3. Geração de Sermões

```javascript
await OpenAIService.generateSermonStructure(
  "A Fé que Move Montanhas",
  "Hebreus 11:1",
  "Jovens"
);
```

Retorna:
- Introdução com ilustração
- Contexto histórico
- 3 pontos principais
- Aplicações práticas
- Conclusão com chamado
- Versículos de apoio

## 🛠️ Arquitetura Técnica

### Estrutura de Arquivos

```
src/
├── services/
│   └── OpenAIService.js       # Serviço principal da OpenAI
└── components/
    ├── AIChatFloating.js      # Chat com IA
    └── ApiKeyConfig.js        # Modal de configuração
```

### OpenAIService.js

```javascript
class OpenAIService {
  // Gerenciamento de API Key
  async saveApiKey(apiKey)
  async getApiKey()
  async removeApiKey()
  async hasApiKey()
  async testApiKey(apiKey)

  // Comunicação com OpenAI
  async sendMessage(messages, options)
  async askBiblicalQuestion(userMessage, history)
  async analyzeVerse(verse, reference)
  async generateSermonStructure(theme, text, audience)
}
```

### Parâmetros da API

```javascript
{
  model: 'gpt-3.5-turbo',      // Modelo usado
  temperature: 0.7,             // Criatividade (0-1)
  max_tokens: 1000,             // Limite de resposta
  messages: [...]               // Histórico de conversa
}
```

## 🧪 Testando a Integração

### Teste Rápido

1. Configure sua API Key
2. Abra o chat
3. Digite: **"Explique João 3:16"**
4. Aguarde a resposta da IA

### Teste Avançado

```javascript
// Pergunta teológica complexa
"Qual a diferença entre justificação e santificação?"

// Análise de contexto
"Qual o contexto histórico de Daniel 3?"

// Preparação de sermão
"Me ajude a preparar um sermão sobre fé para jovens"
```

## ⚡ Configurações Avançadas

### Personalizar System Prompt

Edite `src/services/OpenAIService.js`:

```javascript
const systemPrompt = {
  role: 'system',
  content: `Seu prompt customizado aqui...`
};
```

### Ajustar Parâmetros

```javascript
// Respostas mais criativas
temperature: 0.9

// Respostas mais precisas
temperature: 0.3

// Respostas mais longas
max_tokens: 2000
```

### Usar GPT-4 (Mais Caro)

```javascript
await OpenAIService.sendMessage(messages, {
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  max_tokens: 2000,
});
```

**Custo**: ~$0.01 por 1.000 tokens (5x mais caro)

## 🐛 Troubleshooting

### Erro: "API Key inválida"

- ✅ Verifique se copiou a chave completa
- ✅ Chave deve começar com `sk-`
- ✅ Teste em: [https://platform.openai.com/playground](https://platform.openai.com/playground)

### Erro: "Limite de requisições"

- ✅ Aguarde alguns segundos
- ✅ Verifique sua cota em: [https://platform.openai.com/usage](https://platform.openai.com/usage)
- ✅ Configure limites de taxa

### Erro: "Erro de conexão"

- ✅ Verifique sua internet
- ✅ Tente novamente em alguns segundos
- ✅ Verifique o status da OpenAI: [https://status.openai.com](https://status.openai.com)

### Respostas Lentas

- ✅ Normal, pode levar 3-10 segundos
- ✅ Depende do tamanho da resposta
- ✅ Use GPT-3.5-turbo para respostas mais rápidas

## 📊 Monitoramento de Uso

### Dashboard da OpenAI

Acesse: [https://platform.openai.com/usage](https://platform.openai.com/usage)

Você pode ver:
- Requisições por dia
- Tokens usados
- Custo total
- Gráficos de uso

### Configurar Alertas

1. Vá para: [https://platform.openai.com/account/billing/limits](https://platform.openai.com/account/billing/limits)
2. Configure **"Hard limit"** (limite máximo)
3. Configure **"Soft limit"** (alerta por email)

## 🎓 Recursos Adicionais

### Documentação Oficial

- **OpenAI API**: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- **GPT Guide**: [https://platform.openai.com/docs/guides/gpt](https://platform.openai.com/docs/guides/gpt)
- **Pricing**: [https://openai.com/pricing](https://openai.com/pricing)

### Comunidade

- **Discord**: [https://discord.gg/openai](https://discord.gg/openai)
- **Forum**: [https://community.openai.com](https://community.openai.com)
- **Help Center**: [https://help.openai.com](https://help.openai.com)

## 📝 Changelog

### v1.0.0 (2024-12-30)

- ✅ Integração completa com OpenAI API
- ✅ Chat teológico especializado
- ✅ Sistema de configuração de API Key
- ✅ Análise de versículos
- ✅ Geração de estruturas de sermões
- ✅ Histórico de conversas
- ✅ Tratamento de erros robusto
- ✅ Interface intuitiva

---

**🎉 Pronto! Agora você pode usar o poder da IA para estudar a Bíblia!**

Para dúvidas ou problemas, abra uma issue no GitHub.
