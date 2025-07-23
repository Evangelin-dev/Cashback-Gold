import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AdminProfileData, AdminState, Ornament, UserListState } from '../../types/type';
import {
    addOrnament,
    fetchAllOrnaments,
    updateOrnament,
    deleteOrnament,
    fetchAdminProfile,
    updateUserStatus,
    fetchUsers,
    UserType,
} from '../thunks/adminThunks';

const initialUserListState: UserListState = {
    users: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
};

const initialState: AdminState = {
    ornaments: [],
    status: 'idle',
    error: null,
    currentPage: 0,
    totalPages: 1,
    pageSize: 5,
    currentOrnament: null,
    totalElements: 0,
    profile: null,
    profileStatus: 'idle',
    profileError: null,
    partnerUsers: initialUserListState,
    b2bUsers: initialUserListState,
    normalUsers: initialUserListState,
    actionStatus: 'idle',
};

const getUserStateKey = (userType: UserType): 'partnerUsers' | 'b2bUsers' | 'normalUsers' => {
  if (userType === 'user') {
    return 'normalUsers';
  }
  return `${userType}Users` as 'partnerUsers' | 'b2bUsers';
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setPartnerPage: (state, action: PayloadAction<number>) => {
            state.partnerUsers.currentPage = action.payload;
        },
        setB2bPage: (state, action: PayloadAction<number>) => {
            state.b2bUsers.currentPage = action.payload;
        },
        setNormalPage: (state, action: PayloadAction<number>) => {
            state.normalUsers.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
                  
           .addCase(fetchUsers.pending, (state, action) => {
                const { userType } = action.meta.arg;
                const stateKey = getUserStateKey(userType); 
                state[stateKey].status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                const { userType, data } = action.payload;
                const stateKey = getUserStateKey(userType); 
                const targetState = state[stateKey];

                targetState.status = 'succeeded';
                targetState.users = data.content;
                targetState.totalPages = data.totalPages;
                targetState.totalElements = data.totalElements;
                targetState.currentPage = data.number + 1;
                targetState.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                const { userType } = action.meta.arg;
                const stateKey = getUserStateKey(userType); 
                const targetState = state[stateKey];

                targetState.status = 'failed';
                targetState.error = action.payload as string;
            })

            
            .addCase(updateUserStatus.pending, (state) => {
                state.actionStatus = 'loading';
            })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                state.actionStatus = 'succeeded';
                const { updatedUser, userType } = action.payload;
                const stateKey = getUserStateKey(userType); 

                const userList = state[stateKey].users;
                const userIndex = userList.findIndex(u => u.id === updatedUser.id);

                if (userIndex !== -1) {
                    userList[userIndex].status = updatedUser.status;
                }
            })
            .addCase(updateUserStatus.rejected, (state) => {
                state.actionStatus = 'failed';
            })

            .addCase(fetchAdminProfile.pending, (state) => {
                state.profileStatus = 'loading';
                state.profileError = null;
            })
            .addCase(fetchAdminProfile.fulfilled, (state, action: PayloadAction<AdminProfileData>) => {
                state.profileStatus = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(fetchAdminProfile.rejected, (state, action) => {
                state.profileStatus = 'failed';
                state.profileError = action.payload as string;
            })

            .addCase(fetchAllOrnaments.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllOrnaments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ornaments = action.payload;
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.length < action.meta.arg.size
                    ? state.currentPage + 1
                    : state.currentPage + 2;
            })
            .addCase(fetchAllOrnaments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(addOrnament.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(updateOrnament.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(deleteOrnament.fulfilled, (state) => {
                state.status = 'succeeded';
            })


            .addMatcher(
                (action) => [addOrnament.pending, updateOrnament.pending, deleteOrnament.pending].includes(action.type as any),
                (state) => {
                    state.status = 'loading';
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => [addOrnament.rejected, updateOrnament.rejected, deleteOrnament.rejected].includes(action.type as any),
                (state, action) => {
                    state.status = 'failed';
                    state.error = ((action as any).payload as string) ?? 'An error occurred';
                }
            );

    },

});

export const { setCurrentPage , setPartnerPage, setB2bPage, setNormalPage } = adminSlice.actions;
export default adminSlice.reducer;