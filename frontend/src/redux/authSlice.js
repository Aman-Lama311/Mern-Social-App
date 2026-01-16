import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },

    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },

    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },

    // New reducer to handle following a user
    followUser: (state, action) => {
      const { userId, isFollowing } = action.payload;

      state.suggestedUsers = state.suggestedUsers.map((user) =>
        user._id === userId ? { ...user, isFollowing } : user
      );
    },
  },
});

export const { setAuthUser, setSuggestedUsers, setUserProfile, followUser } =
  authSlice.actions;

export default authSlice.reducer;
