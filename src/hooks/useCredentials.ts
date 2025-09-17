import { useDataContext } from './useDataContext';

export const useCredentials = () => {
  const {
    credentials,
    addCredential,
    updateCredential,
    deleteCredential,
    getCredentialsForPlan
  } = useDataContext();
  
  return {
    credentials,
    addCredential,
    updateCredential,
    deleteCredential,
    getCredentialsForPlan
  };
};

// Keep the original name for backward compatibility
export { useCredentials as useDataCredentials };
