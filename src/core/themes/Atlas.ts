import { type ThemeOptions } from '../types'

export const Atlas: ThemeOptions = {
  name: 'Atlas',
  id: 'adapto-theme',
  prefix: 'adapto',
  darkModeSelector: 'dark-mode',
  loadStyles: true,
  tokens: {
    primitive: {
      white: {
        500: '#ffffff',
      },
      black: {
        500: '#000000',
      },
      green: {
        100: '#d9feeab1',
        500: '#8fefbaff',
      },
      blue: {
        500: '#3b82f6ff',
        700: '#1e40afff',
      },
      size: {
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      spacing: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
    },
    semantic: {
      primary: {
        100: 'green.100',
        500: 'green.500',
      },
      'on-primary': {
        100: 'white.500',
        500: 'white.500',
      },
    },
    component: {
      btn: {
        bg: 'sm.primary.100',
        color: 'sm.on-primary.100',
        disabled: 'pr.white.500',
        padding: 'pr.size.md',
        'line-height': 'cs.1px',
        'margin-y': ['pr.size.sm', 'pr.size.lg'],
      },
    },
  },
  modes: {
    light: {
      semantic: {},
    },
    dark: {
      semantic: {
        primary: 'blue-700',
        secondary: 'green-500',
        background: 'gray-900',
        surface: 'gray-700',
      },
    },
  },
}
