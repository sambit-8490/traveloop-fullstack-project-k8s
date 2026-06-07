import { useAuth } from '../../context/AuthContext';
import TravelerDashboard from './TravelerDashboard';
import GuideDashboard from './GuideDashboard';
import HotelOwnerDashboard from './HotelOwnerDashboard';
import AdminDashboard from '../admin/Admin';

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'guide') return <GuideDashboard />;
  if (user?.role === 'hotel_owner') return <HotelOwnerDashboard />;
  if (user?.role === 'admin') return <AdminDashboard />;
  return <TravelerDashboard />;
}
