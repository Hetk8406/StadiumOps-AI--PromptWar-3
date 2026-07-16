import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '../../config/constants';

/**
 * Reusable Breadcrumb Navigation Component.
 * Maps current URL pathname to readable route hierarchy path.
 */
export default function Breadcrumb(): React.JSX.Element {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map route path segments to friendly readable names
  const getDisplayName = (segment: string) => {
    const names: Record<string, string> = {
      incidents: 'Incidents Feed',
      volunteers: 'Volunteers Core',
      crowd: 'Crowd Operations',
      communications: 'Comms Hub',
      accessibility: 'Accessibility Assistance',
      reports: 'Incident Reports',
      settings: 'Console Settings',
    };
    return names[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-text-muted mb-4">
      <Link
        to={ROUTES.DASHBOARD}
        className="flex items-center hover:text-text-primary transition-colors focus:outline-none focus:underline"
        aria-label="Navigate to Home Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-text-muted/60" aria-hidden="true" />
            {last ? (
              <span className="font-semibold text-text-primary" aria-current="page">
                {getDisplayName(value)}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-text-primary transition-colors focus:outline-none focus:underline"
              >
                {getDisplayName(value)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
