import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUrlParams } from '../utils/urlParams';

const OrganizationContext = createContext();

export function OrganizationProvider({ children }) {
  const [searchParams] = useSearchParams();
  const orgIdFromUrl = searchParams.get('organizationId');
  const [organizationId, setOrganizationId] = useState(orgIdFromUrl || '');

  useEffect(() => {
    if (orgIdFromUrl) {
      setOrganizationId(orgIdFromUrl);
      localStorage.setItem('orgId', orgIdFromUrl);
    }
    // eslint-disable-next-line
  }, [orgIdFromUrl]);

  useEffect(() => {
    const { organizationId: orgIdFromParams } = getUrlParams();
    
    if (orgIdFromParams && !organizationId) {
      console.log('Auto-setting organization ID from URL params:', orgIdFromParams);
      setOrganizationId(orgIdFromParams);
      localStorage.setItem('orgId', orgIdFromParams);
    }
  }, [organizationId]);

  return (
    <OrganizationContext.Provider value={{ organizationId, setOrganizationId }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  return useContext(OrganizationContext);
} 