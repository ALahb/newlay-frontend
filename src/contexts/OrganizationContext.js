import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUrlParams } from '../utils/urlParams';

const OrganizationContext = createContext();

export function OrganizationProvider({ organizationId, children }) {
  const [orgaId, setOrgId] = useState(organizationId || '');

  useEffect(() => {
    if (organizationId) {
      setOrgId(organizationId);
    }
    // eslint-disable-next-line
  }, [organizationId]);

  useEffect(() => {
    const { organizationId: orgIdFromParams } = getUrlParams();

    if (orgIdFromParams && !orgaId) {
      console.log('Auto-setting organization ID from URL params:', orgIdFromParams);
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