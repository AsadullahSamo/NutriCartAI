import { createContext, useContext, useEffect, useState } from 'react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  notifications: boolean;
  dietaryPreferences: string[];
  region: string;
  units: 'metric' | 'imperial';
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  accentColor: '#0ea5e9',
  notifications: true,
  dietaryPreferences: [],
  region: '',
  units: 'metric'
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  updateAccentColor: (color: string) => void; // Special handler for accent color
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Apply theme
    document.documentElement.classList.remove('light', 'dark');
    if (preferences.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(preferences.theme);
    }
    
    // Apply accent color
    document.documentElement.style.setProperty('--accent-color', preferences.accentColor);

    // Dispatch custom event for immediate updates
    window.dispatchEvent(new CustomEvent('preferencesUpdate', {
      detail: { preferences }
    }));
  }, [preferences]);

  // Listen for system theme changes
  useEffect(() => {
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Special function for handling accent color updates with immediate feedback
  const updateAccentColor = (color: string) => {
    // First update localStorage directly for immediate access by other components
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      prefs.accentColor = color;
      localStorage.setItem('userPreferences', JSON.stringify(prefs));
    }
    
    // Apply accent color immediately
    document.documentElement.style.setProperty('--accent-color', color);
    
    // Dispatch an immediate event for all components to listen to
    window.dispatchEvent(new CustomEvent('accentColorChange', { 
      detail: { accentColor: color } 
    }));
    
    // Update state (this will trigger the normal effect to run)
    setPreferences(prev => ({ ...prev, accentColor: color }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{ preferences, updatePreference, resetPreferences, updateAccentColor }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}