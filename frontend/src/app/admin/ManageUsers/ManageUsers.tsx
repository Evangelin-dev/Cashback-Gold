import React from 'react';
import type { User, UserListState } from '../../types/type';
import { UserType } from '../../features/thunks/adminThunks';
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, updateUserStatus, } from '../../features/thunks/adminThunks';
import { setPartnerPage, setB2bPage, setNormalPage } from '../../features/slices/adminSlice';
import { AppDispatch, RootState } from '../../../store';


interface UserCategoryCardProps {
  title: string;
  state: UserListState;
  onPageChange: (page: number) => void;
  onStatusUpdate: (userId: number, action: 'approve' | 'reject', userType: UserType) => void;
  userType: UserType;
  actionInProgress: boolean;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export const UserCategoryCard: React.FC<UserCategoryCardProps> = ({ title, state, onPageChange, onStatusUpdate, userType, actionInProgress }) => {
  const { users, status, error, currentPage, totalPages } = state;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-[#7a1335]/10">
      <h2 className="text-lg sm:text-xl font-bold text-[#7a1335] mb-3 sm:mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-[#7a1335] rounded-full"></span>
        {title}
      </h2>

      {status === 'loading' && <div className="flex justify-center items-center min-h-[200px]">Loading...</div>}
      {status === 'failed' && <div className="flex justify-center items-center min-h-[200px] text-red-500">{error}</div>}
      
      {status === 'succeeded' && (
        <>
          <div className="space-y-3 sm:space-y-4 min-h-[200px]">
            {users.length > 0 ? users.map((user) => (
              <div key={user.id} className="rounded-lg sm:rounded-xl border border-[#7a1335]/10 p-3 sm:p-4 bg-[#fbeaf0]/40 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#7a1335] text-sm sm:text-base truncate">{user.email}</div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate">{user.mobile}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center lg:items-center">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[user.status]} whitespace-nowrap`}>
                      {user.status.charAt(0) + user.status.slice(1).toLowerCase()}
                    </span>
                    <div>
                      <select
                        defaultValue="default"
                        disabled={actionInProgress}
                        onChange={e => {
                           if (e.target.value === 'approve' || e.target.value === 'reject') {
                             onStatusUpdate(user.id, e.target.value, userType);
                           }
                        }}
                        className="px-2 py-1 rounded-full border text-xs font-semibold bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="default" disabled>Set Status</option>
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )) : <div className="flex justify-center items-center min-h-[200px] text-gray-400 text-sm sm:text-base">No users found.</div>}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
              <button
                className="px-2 sm:px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs sm:text-sm disabled:opacity-50"
                disabled={currentPage === 1 }
                onClick={() => onPageChange(currentPage - 1)}
              >
                Prev
              </button>
              <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-2 sm:px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs sm:text-sm disabled:opacity-50"
                disabled={currentPage === totalPages }
                onClick={() => onPageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const PAGE_SIZE = 3;

const ManageUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { partnerUsers, b2bUsers, normalUsers, actionStatus } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    if (partnerUsers.status === 'idle') {
      dispatch(fetchUsers({ userType: 'partner', page: 1, size: PAGE_SIZE }));
    }
    if (b2bUsers.status === 'idle') {
      dispatch(fetchUsers({ userType: 'b2b', page: 1, size: PAGE_SIZE }));
    }
    if (normalUsers.status === 'idle') {
      dispatch(fetchUsers({ userType: 'user', page: 1, size: PAGE_SIZE }));
    }
  }, [dispatch, partnerUsers.status, b2bUsers.status, normalUsers.status]);

  const handlePageChange = (userType: UserType, page: number) => {
    dispatch(fetchUsers({ userType, page, size: PAGE_SIZE }));
  };

  const handleStatusUpdate = (userId: number, action: 'approve' | 'reject', userType: UserType) => {
    dispatch(updateUserStatus({ userId, action, userType }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-white p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#7a1335] mb-4 sm:mb-6 lg:mb-8 text-center lg:text-left">
          Manage Users
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
          <UserCategoryCard
            title="Partner Users"
            state={partnerUsers}
            userType="partner"
            onPageChange={(page) => handlePageChange('partner', page)}
            onStatusUpdate={handleStatusUpdate}
            actionInProgress={actionStatus === 'loading'}
          />
          <UserCategoryCard
            title="B2B Users"
            state={b2bUsers}
            userType="b2b"
            onPageChange={(page) => handlePageChange('b2b', page)}
            onStatusUpdate={handleStatusUpdate}
            actionInProgress={actionStatus === 'loading'}
          />
        </div>

        <UserCategoryCard
          title="Normal Users"
          state={normalUsers}
          userType="user"
          onPageChange={(page) => handlePageChange('user', page)}
          onStatusUpdate={handleStatusUpdate}
          actionInProgress={actionStatus === 'loading'}
        />
      </div>
    </div>
  );
};

export default ManageUsers;