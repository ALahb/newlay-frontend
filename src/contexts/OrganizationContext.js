import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OrganizationContext = createContext();

export function OrganizationProvider({ children }) {
  const [searchParams] = useSearchParams();
  const orgIdFromUrl = searchParams.get('organizationId');
  const [organizationId, setOrganizationId] = useState(orgIdFromUrl || '');

  // If orgId is present in URL, update context (only on first load)
  useEffect(() => {
    if (orgIdFromUrl) {
      setOrganizationId(orgIdFromUrl);
      localStorage.setItem('orgId', orgIdFromUrl);
    }
    // eslint-disable-next-line
  }, [orgIdFromUrl]);

  return (
    <OrganizationContext.Provider value={{ organizationId, setOrganizationId }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  return useContext(OrganizationContext);
} 