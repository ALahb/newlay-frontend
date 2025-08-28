import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUrlParams } from '../utils/urlParams';

const OrganizationContext = createContext();

export function OrganizationProvider({ organizationId, children }) {
  const [orgaId, setOrgId] = useState(organizationId || '');

  useEffect(() => {
    if (organizationId) {
      setOrgId(organizationId);
      localStorage.setItem('orgId', organizationId);
    }
    // eslint-disable-next-line
  }, [organizationId]);

  useEffect(() => {
    const { orgaId: orgIdFromParams } = getUrlParams();

    if (orgIdFromParams && !orgaId) {
      console.log('Auto-setting organization ID from URL params:', orgIdFromParams);
      setOrgId(orgIdFromParams);
      localStorage.setItem('orgId', orgIdFromParams);
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