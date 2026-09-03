
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
            mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
          },
          colors: {
            brand: {
              50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
              400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
              800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
            },
          },
          borderRadius: {
            '2xl': '16px',
            '3xl': '24px',
          },
          boxShadow: {
            'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 10px 20px -2px rgba(0, 0, 0, 0.02)',
            'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          },
          animation: {
            'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          },
          keyframes: {
            fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
            slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
            slideDown: { from: { opacity: '0', transform: 'translateY(-12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
            scaleIn: { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
          }
        }
      }
    }
  
