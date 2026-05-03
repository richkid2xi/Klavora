import { useState, useMemo } from 'react';
import { useApp, staffMembers as initialStaff } from '@/context/AppContext';
import type { Staff, Transaction } from '@/mocks/types';
import StaffCard from '@/pages/staff/components/StaffCard';
import StaffActivityDrawer from '@/pages/staff/components/StaffActivityDrawer';

const COLORS = ['#10B981', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

export interface StaffStats {
  member: Staff;
  totalSalesToday: number;
  totalUnitsToday: number;
  totalSalesAllTime: number;
  totalUnitsAllTime: number;
  recentTransactions: Transaction[];
  lastActive: string;
}

export { timeAgo };

export default function StaffPage() {
  const { user, transactions } = useApp();
  const [staff, setStaff] = useState<Staff[]>(initialStaff.filter(s => s.role === 'staff'));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'sales'|'restock'|'general'|'other'>('general');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [formError, setFormError] = useState('');
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffStats | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  const staffStats: StaffStats[] = useMemo(() => {
    return staff.map(member => {
      const memberTxns = transactions.filter(t => t.staffId === member.id);
      const todayTxns = memberTxns.filter(t => t.timestamp.startsWith(todayStr) && t.type === 'Sale');
      const allSales = memberTxns.filter(t => t.type === 'Sale');

      // Derive last active from most recent transaction or fallback to member.lastActive
      const mostRecent = memberTxns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      const lastActive = mostRecent ? mostRecent.timestamp : member.lastActive;

      return {
        member,
        totalSalesToday: todayTxns.length,
        totalUnitsToday: todayTxns.reduce((s, t) => s + t.quantity, 0),
        totalSalesAllTime: allSales.length,
        totalUnitsAllTime: allSales.reduce((s, t) => s + t.quantity, 0),
        recentTransactions: memberTxns.slice(0, 10),
        lastActive,
      };
    });
  }, [staff, transactions, todayStr]);

  // Summary totals
  const totalUnitsToday = staffStats.reduce((s, st) => s + st.totalUnitsToday, 0);
  const totalSalesToday = staffStats.reduce((s, st) => s + st.totalSalesToday, 0);
  const mostActiveMember = staffStats.reduce((best, cur) =>
    cur.totalUnitsAllTime > (best?.totalUnitsAllTime ?? -1) ? cur : best, staffStats[0]);

  if (user?.role !== 'owner') {
    return <div className="p-6 text-sm text-gray-400 font-body">Owner access only.</div>;
  }

  const handleSave = () => {
    setFormError('');
    if (!newName.trim()) { setFormError('Name is required.'); return; }
    
    // Validate PIN (optional on edit if not changing, required on add)
    const isChangingPin = newPin.length > 0 || confirmPin.length > 0;
    if (!editingId || isChangingPin) {
      if (newPin.length !== 4) { setFormError('PIN must be exactly 4 digits.'); return; }
      if (newPin !== confirmPin) { setFormError('PINs do not match.'); return; }
    }

    if (editingId) {
      setStaff(prev => prev.map(s => {
        if (s.id !== editingId) return s;
        return {
          ...s,
          name: newName.trim(),
          staffRole: newRole,
          pin: isChangingPin ? newPin : s.pin,
          initials: newName.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
        };
      }));
    } else {
      const initials = newName.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const color = COLORS[staff.length % COLORS.length];
      const newMember: Staff = {
        id: 'staff-' + Date.now(),
        name: newName.trim(),
        pin: newPin,
        color,
        initials,
        lastActive: new Date().toISOString(),
        role: 'staff',
        staffRole: newRole,
      };
      setStaff(prev => [...prev, newMember]);
    }

    setShowForm(false);
  };

  const openAddForm = () => {
    setEditingId(null);
    setNewName('');
    setNewRole('general');
    setNewPin('');
    setConfirmPin('');
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (member: Staff) => {
    setEditingId(member.id);
    setNewName(member.name);
    setNewRole(member.staffRole || 'general');
    setNewPin(''); // Reset PIN fields
    setConfirmPin('');
    setFormError('');
    setShowForm(true);
  };

  const handleRemove = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    setRemoveId(null);
    if (selectedStaff?.member.id === id) setSelectedStaff(null);
  };

  return (
    <div className="p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white">Staff</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-0.5">
            <span className="font-mono">{staff.length}</span> staff members
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="h-btn px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-user-add-line mr-2"></i>Add Staff
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Sales Today</span>
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10">
              <i className="ri-shopping-bag-line text-primary-500 text-sm"></i>
            </div>
          </div>
          <p className="text-2xl font-mono font-700 text-gray-900 dark:text-white">{totalSalesToday}</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">transactions across all staff</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Units Sold Today</span>
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-success-50 dark:bg-success-500/10">
              <i className="ri-stack-line text-success-500 text-sm"></i>
            </div>
          </div>
          <p className="text-2xl font-mono font-700 text-gray-900 dark:text-white">{totalUnitsToday}</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">units dispensed today</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Top Performer</span>
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <i className="ri-award-line text-amber-500 text-sm"></i>
            </div>
          </div>
          {mostActiveMember ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-heading font-700 flex-shrink-0" style={{ backgroundColor: mostActiveMember.member.color }}>
                  {mostActiveMember.member.initials}
                </div>
                <p className="text-sm font-heading font-600 text-gray-900 dark:text-white truncate">{mostActiveMember.member.name}</p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">
                <span className="font-mono">{mostActiveMember.totalUnitsAllTime}</span> units all time
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400 font-body">No data yet</p>
          )}
        </div>
      </div>

      {/* Staff grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {staffStats.map(stats => (
          <StaffCard
            key={stats.member.id}
            stats={stats}
            timeAgo={timeAgo}
            onView={() => setSelectedStaff(stats)}
            onEdit={() => openEditForm(stats.member)}
            onRemove={() => setRemoveId(stats.member.id)}
          />
        ))}
      </div>

      {/* Activity drawer */}
      {selectedStaff && (
        <StaffActivityDrawer
          stats={selectedStaff}
          timeAgo={timeAgo}
          onClose={() => setSelectedStaff(null)}
        />
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-0 md:p-4" onClick={() => setShowForm(false)}>
          <div className="w-full md:max-w-sm bg-surface-light dark:bg-surface-dark rounded-t-2xl md:rounded-card border border-border-light dark:border-border-dark p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white mb-5">
              {editingId ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Ama Owusu"
                  className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Role / Responsibility</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as any)}
                  className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
                >
                  <option value="general">General</option>
                  <option value="sales">Sales</option>
                  <option value="restock">Restock</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {editingId && (
                <p className="text-xs text-gray-500 dark:text-gray-400 font-body mb-2">Leave PIN blank if you don't want to change it.</p>
              )}
              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">
                  {editingId ? 'New 4-Digit PIN' : '4-Digit PIN'}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors tracking-widest"
                />
              </div>
              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors tracking-widest"
                />
              </div>
              {formError && (
                <div className="flex items-center gap-2 text-danger-500 text-sm font-body bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                  <i className="ri-error-warning-line flex-shrink-0"></i>
                  <span>{formError}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={handleSave} className="flex-1 h-btn bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">
                {editingId ? 'Save Changes' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove confirm */}
      {removeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setRemoveId(null)}>
          <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white mb-2">Remove Staff Member?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-5">Their full audit history will be preserved in the log.</p>
            <div className="flex gap-3">
              <button onClick={() => setRemoveId(null)} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => handleRemove(removeId)} className="flex-1 h-btn bg-danger-500 hover:bg-danger-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
