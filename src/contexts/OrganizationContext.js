import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthentication } from './AuthenticationContext';
import { getUrlParams } from '../utils/urlParams';

const OrganizationContext = createContext();

export function OrganizationProvider({ children }) {
  const { organizationId: authOrgId } = useAuthentication();
  const [orgaId, setOrgId] = useState(authOrgId || '');

  useEffect(() => {
    if (authOrgId) {
      setOrgId(authOrgId);
    }
  }, [authOrgId]);

  useEffect(() => {
    const { organizationId: orgIdFromParams } = getUrlParams();

    if (orgIdFromParams && !orgaId) {
      setOrgId(orgIdFromParams);
    }
  }, [orgaId]);

  return (
    <OrganizationContext.Provider value={{ orgaId, setOrgId }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  return useContext(OrganizationContext);
} 