import { useState } from 'react';
import {
  Edit2,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';

// Define the profile structure
type ProfileType = {
  email: string | null;
  phone: string | null;
  role: string | null;
};

const LMyProfile = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
    const { currentUser } = useSelector((state: RootState) => state.auth);

  const [profile, setProfile] = useState<ProfileType>({
    email: currentUser?.email || '',
    phone: currentUser?.mobile || '', 
    role : currentUser?.role || '',
  });

  const [editedProfile, setEditedProfile] = useState<ProfileType>(profile);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (
    field: keyof ProfileType,
    value: string
  ): void => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#7a1335]">My Profile</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-[#7a1335] text-white rounded-lg hover:bg-[#5a0f26] transition-colors"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={18} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#7a1335] to-[#9a1a42] p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{profile.name}</h3>
              <p className="text-white/80">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User size={16} className="text-[#7a1335]" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1335]"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                {profile.name}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar size={16} className="text-[#7a1335]" />
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type="date"
                value={editedProfile.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1335]"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                {formatDate(profile.dob)}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users size={16} className="text-[#7a1335]" />
              Gender
            </label>
            {isEditing ? (
              <select
                value={editedProfile.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1335]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                {profile.gender}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Mail size={16} className="text-[#7a1335]" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1335]"
                placeholder="Enter your email address"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                {profile.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Phone size={16} className="text-[#7a1335]" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1335]"
                placeholder="Enter your phone number"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                {profile.phone}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPin size={16} className="text-[#7a1335]" />
              Address
            </label>
            {isEditing ? (
              <textarea
                value={editedProfile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1335] resize-none"
                placeholder="Enter your full address"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                {profile.address}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Make sure all information is accurate before saving changes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMyProfile;
