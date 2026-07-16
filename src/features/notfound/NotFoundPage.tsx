import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/constants';

/**
 * 404 Page Placeholder
 */
export default function NotFoundPage(): React.JSX.Element {
  useEffect(() => {
    document.title = 'Page Not Found - StadiumOps AI';
  }, []);

  return (
    <section aria-labelledby="not-found-title" className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
      <h1 id="not-found-title" className="text-4xl font-extrabold text-stadium-blue-900 dark:text-white">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-md">
        The page you are looking for does not exist or has been relocated within the operations blueprint.
      </p>
      <Link
        to={ROUTES.DASHBOARD}
        className="mt-6 inline-flex items-center px-4 py-2 bg-stadium-blue-900 text-white rounded font-medium hover:bg-stadium-blue-500 focus:outline focus:ring-2 focus:ring-stadium-gold-500"
      >
        Return to Dashboard
      </Link>
    </section>
  );
}
