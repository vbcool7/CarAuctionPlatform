
export const getStatusColor = (status) => {
  const map = {
    active: 'bg-green-50 text-green-700',
    verified: 'bg-green-50 text-green-700',
    inactive: 'bg-slate-100 text-slate-500',
    pending: 'bg-amber-50 text-amber-700',
    suspended: 'bg-red-50 text-red-700',
    rejected: 'bg-red-50 text-red-700',
  };
  return map[status?.toLowerCase()] || 'bg-slate-100 text-slate-500';
};