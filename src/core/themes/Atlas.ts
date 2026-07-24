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
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      spacing: {
        base: '4px',
        md: '8px',
        lg: '16px',
      },
      radius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      text: {
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
      },
      overlay: {
        scrim: 'rgba(0, 0, 0, 0.35)',
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
        'padding-block': 'pr.spacing.base',
        'padding-inline': 'pr.spacing.base',
        // 'line-height': 'cs.1px',
        neutral: 'pr.black.500',
        surface: 'pr.white.500',
        'font-size': 'pr.text.base',
        gap: 'cs.0.5rem',
      },
      dialog: {
        backdrop: 'pr.overlay.scrim',
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
