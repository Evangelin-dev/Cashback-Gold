import { useEffect, useState, FC } from 'react';
import { Calendar, Mail, MapPin, Phone, User, Users } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance'; // Adjust path to your axios instance
import type { UserProfile } from '../../types/type'; // Adjust path to your types

// A simple loader component for better UX
const Loader: FC = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#6a0822]"></div>
        <p className="ml-4 text-gray-700">Loading Profile...</p>
    </div>
);

// A reusable component to display each profile item
const ProfileDetail: FC<{ icon: React.ElementType; label: string; value: string }> = ({
    icon: Icon,
    label,
    value,
}) => (
    <div className="space-y-1">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <Icon size={14} className="text-[#6a0822]" />
            {label}
        </label>
        <p className="text-gray-900 font-medium bg-gray-50 p-2.5 rounded-md border border-gray-200 text-sm">
            {value || 'Not Provided'}
        </p>
    </div>
);

const LMyProfile: FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get<UserProfile>('/user/profile');
                setProfile(response.data);
            } catch (err) {
                setError('Failed to load your profile. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []); // Empty dependency array ensures this runs only once

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'Not Provided';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatAddress = (p: UserProfile): string => {
      // Filters out any empty parts and joins them with a comma
      return [p.town, p.city, p.state, p.country].filter(Boolean).join(', ');
    }

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>;
    }

    if (!profile) {
        return <div className="text-center text-gray-600">No profile data found.</div>;
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#6a0822]">My Profile</h2>
                <p className="text-gray-500 text-sm">Your personal information is displayed below.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-[#6a0822] p-5 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center ring-4 ring-white/30">
                            <User size={36} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-wide">{profile.fullName}</h3>
                            <p className="text-white/80 text-sm">{profile.email}</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <ProfileDetail icon={User} label="Full Name" value={profile.fullName} />
                    <ProfileDetail icon={Calendar} label="Date of Birth" value={formatDate(profile.dob)} />
                    <ProfileDetail icon={Users} label="Gender" value={profile.gender} />
                    <ProfileDetail icon={Mail} label="Email Address" value={profile.email} />
                    <ProfileDetail icon={Phone} label="Phone Number" value={profile.mobile} />
                    <div className="md:col-span-2">
                        <ProfileDetail icon={MapPin} label="Address" value={formatAddress(profile)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LMyProfile;