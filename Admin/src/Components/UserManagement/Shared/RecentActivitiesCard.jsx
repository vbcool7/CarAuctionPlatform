
function RecentActivitiesCard({ items = [], onViewAll }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">Recent Activities</h3>
      <div className="space-y-4 mb-3">
        {items.length === 0 && <p className="text-sm text-slate-400">No recent activity</p>}
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            {item.icon || <div className="w-6 h-6 rounded bg-slate-100 shrink-0" />}
            <div>
              <p className="text-sm text-slate-800">{item.text}</p>
              <p className="text-xs text-slate-400">{item.date ? new Date(item.date).toLocaleString() : ''}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onViewAll} className="text-sm font-medium text-[#D97706]">View All Activities</button>
    </div>
  );
}

export default RecentActivitiesCard;