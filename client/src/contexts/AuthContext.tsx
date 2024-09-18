import { createContext, useEffect, useMemo, useState, ReactNode } from 'react';

export const AuthContext = createContext({} as CtxValue);

interface ProviderProps {
  children: ReactNode;
}

interface State {
  username: string;
}

type CtxValue = {
  updateData: (data: Partial<State>) => void;
} & State;

export function AuthProvider({ children }: ProviderProps) {
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState<State>({
    username: '',
  });

  const initialize = async () => {
    try {
      
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = (data: Partial<State>) => {
    setState((prev) => ({ ...prev, ...data }));
  };

  const value = useMemo(
    () => ({
      username: state.username,
      updateData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, loading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
