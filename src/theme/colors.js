// Paleta de Cores do Design System
export const colors = {
  // Primárias
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5', // Indigo 600 - Primary
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea', // Purple 600 - Secondary
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Backgrounds
  slate: {
    50: '#f8fafc',  // Background principal
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Módulos específicos
  modules: {
    // Azul - Leis de Deus
    laws: {
      from: '#3b82f6',
      to: '#06b6d4',
      bg: '#eff6ff',
      border: '#bfdbfe',
      text: '#1d4ed8',
    },
    // Verde - Saúde
    health: {
      from: '#10b981',
      to: '#14b8a6',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: '#15803d',
    },
    // Âmbar - Dízimos
    tithes: {
      from: '#f59e0b',
      to: '#f97316',
      bg: '#fffbeb',
      border: '#fde68a',
      text: '#b45309',
    },
    // Vermelho - Profecia
    prophecy: {
      from: '#ef4444',
      to: '#f43f5e',
      bg: '#fef2f2',
      border: '#fecaca',
      text: '#b91c1c',
    },
    // Roxo - Família
    family: {
      from: '#a855f7',
      to: '#d946ef',
      bg: '#faf5ff',
      border: '#e9d5ff',
      text: '#7e22ce',
    },
    // Índigo - Parábolas
    parables: {
      from: '#6366f1',
      to: '#8b5cf6',
      bg: '#eef2ff',
      border: '#c7d2fe',
      text: '#4338ca',
    },
    // Amarelo - Reino
    kingdom: {
      from: '#eab308',
      to: '#facc15',
      bg: '#fefce8',
      border: '#fef08a',
      text: '#a16207',
    },
    // Teal - Criação
    creation: {
      from: '#14b8a6',
      to: '#06b6d4',
      bg: '#f0fdfa',
      border: '#99f6e4',
      text: '#0f766e',
    },
  },

  // Gradientes padrão
  gradients: {
    primary: ['#4f46e5', '#7c3aed'], // Indigo → Purple
    success: ['#10b981', '#14b8a6'], // Green → Teal
    warning: ['#f59e0b', '#f97316'], // Amber → Orange
    danger: ['#ef4444', '#f43f5e'], // Red → Rose
    info: ['#3b82f6', '#06b6d4'], // Blue → Cyan
  },

  // Status
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Neutros
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

// Tema para React Native Paper
export const paperTheme = {
  colors: {
    primary: colors.primary[600],
    secondary: colors.secondary[600],
    accent: colors.secondary[500],
    background: colors.slate[50],
    surface: colors.white,
    text: colors.slate[900],
    disabled: colors.slate[400],
    placeholder: colors.slate[400],
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onSurface: colors.slate[900],
    notification: colors.primary[600],
  },
  dark: false,
};
