import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * Automatically syncs state with localStorage and handles JSON serialization
 * 
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, Function, Function]} - [storedValue, setValue, removeValue]
 */
const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Set value in localStorage and state
   */
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function like useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  /**
   * Remove value from localStorage and reset to initial value
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  /**
   * Listen for changes to localStorage from other tabs/windows
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    // Listen for storage changes from other tabs
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;

/**
 * Usage Examples:
 * 
 * 1. Basic usage with string:
 * 
 * function MyComponent() {
 *   const [name, setName] = useLocalStorage('user-name', 'Guest');
 *   
 *   return (
 *     <input 
 *       value={name}
 *       onChange={(e) => setName(e.target.value)}
 *     />
 *   );
 * }
 * 
 * 
 * 2. Usage with object:
 * 
 * function SettingsComponent() {
 *   const [settings, setSettings, removeSettings] = useLocalStorage('app-settings', {
 *     theme: 'light',
 *     language: 'en',
 *     notifications: true
 *   });
 *   
 *   const updateTheme = (theme) => {
 *     setSettings({ ...settings, theme });
 *   };
 *   
 *   return (
 *     <div>
 *       <select value={settings.theme} onChange={(e) => updateTheme(e.target.value)}>
 *         <option value="light">Light</option>
 *         <option value="dark">Dark</option>
 *       </select>
 *       <button onClick={removeSettings}>Reset Settings</button>
 *     </div>
 *   );
 * }
 * 
 * 
 * 3. Usage with array:
 * 
 * function CasesComponent() {
 *   const [cases, setCases, removeCases] = useLocalStorage('saved-cases', []);
 *   
 *   const addCase = (newCase) => {
 *     setCases([...cases, newCase]);
 *   };
 *   
 *   const removeCase = (caseId) => {
 *     setCases(cases.filter(c => c.id !== caseId));
 *   };
 *   
 *   return (
 *     <div>
 *       {cases.map(caseItem => (
 *         <div key={caseItem.id}>
 *           {caseItem.title}
 *           <button onClick={() => removeCase(caseItem.id)}>Remove</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * 
 * 4. Functional update (like setState):
 * 
 * function CounterComponent() {
 *   const [count, setCount] = useLocalStorage('counter', 0);
 *   
 *   const increment = () => {
 *     setCount(prevCount => prevCount + 1);
 *   };
 *   
 *   return <button onClick={increment}>Count: {count}</button>;
 * }
 */