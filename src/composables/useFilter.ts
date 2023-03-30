import { VFilter } from 'src/components/DataTable/types';

export default function useFilter() {
  const handleFilterRows = (filters: VFilter, rows: any[]) => {
    return rows.filter((row) => {
      return Object.keys(filters).every((field) => {
        if (!filters[field]) {
          delete filters[field];
          return true;
        }
        return row[field] ? String(row[field]).toLowerCase().includes(filters[field].toLowerCase()) : false;
      });
    });
  };

  const handleGlobalFilter = (filter: string, rows: any[]) => {
    return rows.filter((row) => {
      return Object.values(row).some((value) => {
        return String(value).toLowerCase().includes(filter.toLowerCase());
      });
    });
  };

  return { handleFilterRows, handleGlobalFilter };
}