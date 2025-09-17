import { useDataContext } from './useDataContext';

export const useCookies = () => {
  const {
    cookies,
    addCookie,
    updateCookie,
    deleteCookie,
    getCookiesForPlan
  } = useDataContext();
  
  return {
    cookies,
    addCookie,
    updateCookie,
    deleteCookie,
    getCookiesForPlan
  };
};

// Keep the original name for backward compatibility
export { useCookies as useDataCookies };
