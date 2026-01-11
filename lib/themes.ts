export interface Theme {
  id: string
  name: string
  colors: {
    accent: string
    accentHover: string
    bgDark: string
    bgCard: string
    bgElevated: string
    textPrimary: string
    textSecondary: string
    border: string
    success: string
    warning: string
    danger: string
  }
}

export const themes: Theme[] = [
  {
    id: 'purple-tech',
    name: 'Purple Tech',
    colors: {
      accent: '#8B5CF6',
      accentHover: '#7C3AED',
      bgDark: '#0F0F1A',
      bgCard: '#1A1A2E',
      bgElevated: '#252542',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    },
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    colors: {
      accent: '#3B82F6',
      accentHover: '#2563EB',
      bgDark: '#0A1628',
      bgCard: '#152238',
      bgElevated: '#1E3A5F',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    colors: {
      accent: '#10B981',
      accentHover: '#059669',
      bgDark: '#0A1A14',
      bgCard: '#132A21',
      bgElevated: '#1C3D2E',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    },
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    colors: {
      accent: '#F97316',
      accentHover: '#EA580C',
      bgDark: '#1A0F0A',
      bgCard: '#2E1A13',
      bgElevated: '#42251C',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    },
  },
  {
    id: 'midnight-dark',
    name: 'Midnight Dark',
    colors: {
      accent: '#A78BFA',
      accentHover: '#8B5CF6',
      bgDark: '#09090B',
      bgCard: '#18181B',
      bgElevated: '#27272A',
      textPrimary: '#FAFAFA',
      textSecondary: '#A1A1AA',
      border: '#3F3F46',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    },
  },
]

export const getThemeById = (id: string): Theme => {
  return themes.find((t) => t.id === id) || themes[0]
}

export const getThemeCSSVars = (theme: Theme): string => {
  return `
    --accent: ${theme.colors.accent};
    --accent-hover: ${theme.colors.accentHover};
    --bg-dark: ${theme.colors.bgDark};
    --bg-card: ${theme.colors.bgCard};
    --bg-elevated: ${theme.colors.bgElevated};
    --text-primary: ${theme.colors.textPrimary};
    --text-secondary: ${theme.colors.textSecondary};
    --border: ${theme.colors.border};
    --success: ${theme.colors.success};
    --warning: ${theme.colors.warning};
    --danger: ${theme.colors.danger};
  `
}
