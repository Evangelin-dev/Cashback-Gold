import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminProfile } from "../../features/thunks/adminThunks";

interface ProfileAvatarProps {
  imageUrl: string | null;
  name: string;
  sizeClasses?: string;
}


const getInitials = (name: string): string => {
  if (!name) return 'A';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  if (parts.length > 1) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return 'A';
};

const ProfileAvatar = ({ imageUrl, name, sizeClasses = 'w-full h-full' }: ProfileAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  const showPlaceholder = !imageUrl || hasError;

  return (
    <div className={`${sizeClasses} rounded-full object-cover border-2 border-white shadow-md`}>
      {showPlaceholder ? (
        <div
          className="w-full h-full rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center"
        >
          <span className="text-4xl font-bold text-[#7a1335]">
            {getInitials(name)}
          </span>
        </div>
      ) : (

        <img
          src={imageUrl}
          alt={`${name}'s Avatar`}
          className="w-full h-full rounded-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};




const ProfileSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-100 p-8 max-w-lg w-full animate-pulse">
    <div className="text-center mb-8">
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 rounded-full bg-gray-200"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded-md w-48 mx-auto mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-full w-32 mx-auto"></div>
    </div>
    <div className="space-y-6">
      <div className="h-20 bg-gray-200 rounded-xl"></div>
      <div className="h-20 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);


const AdminProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, profileStatus, profileError } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    if (profileStatus === 'idle') {
      dispatch(fetchAdminProfile());
    }
  }, [profileStatus, dispatch]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      {profileStatus === 'loading' && <ProfileSkeleton />}
      {profileStatus === 'failed' && (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600">Failed to Load Profile</h2>
          <p className="text-gray-600 mt-2">{profileError || "An unknown error occurred."}</p>
        </div>
      )}
      {profileStatus === 'succeeded' && profile && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-100 p-8 max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-rose-200/20 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 p-1 shadow-lg">
                  <ProfileAvatar
                    imageUrl={profile.avatarUrl}
                    name={profile.fullName}
                  />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.fullName}</h1>
              <p className="text-pink-600 font-semibold text-lg bg-pink-50 px-4 py-2 rounded-full inline-block">
                {profile.role}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-700">
                  {profile.email}
                </div>
              </div>

              <div>
                <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone Number
                </label>
                <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-700">
                  {profile.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;