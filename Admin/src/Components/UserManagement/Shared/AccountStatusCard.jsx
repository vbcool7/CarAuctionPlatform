
import {getStatusColor} from './statusColors';

function AccountStatusCard({ fields }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">Account Status</h3>
      <div className="space-y-3">
        {fields.map((f, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-slate-500">{f.label}</span>
            {f.type === 'badge' && (
              <span className={`text-[12px] font-semibold px-2 py-0.5 rounded capitalize ${getStatusColor(f.value)}`}>
                {f.value || '--'}
              </span>
            )}
            {f.type === 'boolean' && (
              <span className={`text-sm font-medium flex items-center gap-1 ${f.value ? 'text-green-600' : 'text-slate-400'}`}>
                {f.value ? '✓ Yes' : 'No'}
              </span>
            )}
            {f.type === 'text' && (
              <span className="text-sm font-semibold text-slate-900">{f.value || '--'}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountStatusCard;