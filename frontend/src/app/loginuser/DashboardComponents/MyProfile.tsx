import {
  Calendar,
  Edit2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

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
    <div className="p-2 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#6a0822]">My Profile</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#6a0822] text-white rounded hover:bg-[#4a0617] text-sm"
          >
            <Edit2 size={16} />
            Edit
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
        <div className="bg-[#6a0822] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{profile.name}</h3>
              <p className="text-white/80 text-xs">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Name */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
              <User size={14} className="text-[#6a0822]" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#6a0822] text-sm"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-2 rounded">
                {profile.name}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
              <Calendar size={14} className="text-[#6a0822]" />
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type="date"
                value={editedProfile.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#6a0822] text-sm"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-2 rounded">
                {formatDate(profile.dob)}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
              <Users size={14} className="text-[#6a0822]" />
              Gender
            </label>
            {isEditing ? (
              <select
                value={editedProfile.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#6a0822] text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-2 rounded">
                {profile.gender}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
              <Mail size={14} className="text-[#6a0822]" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#6a0822] text-sm"
                placeholder="Enter your email address"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-2 rounded">
                {profile.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
              <Phone size={14} className="text-[#6a0822]" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#6a0822] text-sm"
                placeholder="Enter your phone number"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-2 rounded">
                {profile.phone}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1 md:col-span-2">
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
              <MapPin size={14} className="text-[#6a0822]" />
              Address
            </label>
            {isEditing ? (
              <textarea
                value={editedProfile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#6a0822] text-sm resize-none"
                placeholder="Enter your full address"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 p-2 rounded">
                {profile.address}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="bg-gray-50 px-3 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 flex items-center gap-1">
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
