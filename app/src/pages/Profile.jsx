import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operator profile"
        description="Verify badge details, performance records, and log active console sessions."
        breadcrumbs={[{ label: 'Profile' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-semibold">
        <Card title="Operator Profile Card" className="text-center flex flex-col items-center">
          <img 
            src={user?.avatarUrl} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-md mb-4" 
          />
          <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{user?.name}</h4>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{user?.role} Badge: {user?.badgeId}</span>
        </Card>

        <Card title="Operator Security Settings" className="lg:col-span-2">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Operator Name</label>
                <input type="text" defaultValue={user?.name} className="w-full px-3 py-2 border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Email Address</label>
                <input type="email" disabled defaultValue={user?.email} className="w-full px-3 py-2 border dark:border-slate-750 bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 rounded-xl cursor-not-allowed" />
              </div>
            </div>
            <Button>Save Profile</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
