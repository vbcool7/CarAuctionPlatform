
import { useSearchParams } from 'react-router-dom';

const isEmpty = (v) => v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length);

export const useListingFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Update multiple keys at once; separate setSearchParams calls overwrite each other
  const setFilters = (obj) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(obj).forEach(([key, value]) => {
        if (isEmpty(value)) next.delete(key);
        else next.set(key, Array.isArray(value) ? value.join(',') : String(value));
      });
      next.set('page', '1'); // filter change then page reset to 1
      return next;
    });
  };

  const setFilter = (key, value) => setFilters({ [key]: value });

  // Separate for pagination; do not reset the page
  const setPage = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
  };

  const clearAll = () => setSearchParams({});

  const params = Object.fromEntries(searchParams);

  return { params, setFilter, setFilters, setPage, clearAll };
};