import { apiSlice } from './apiSlice';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<any, void | any>({
      query: () => '/profile/me',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: '/profile/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    getQuestions: builder.query<any, void | any>({
      query: () => '/meta/questions',
      providesTags: ['Interest'],
    }),
    submitPersonality: builder.mutation<any, { questionNumber: number; answer: number }[]>({
      query: (answers) => ({
        url: '/profile/personality',
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: ['Profile'],
    }),
    getInterests: builder.query<any, void | any>({
      query: () => '/meta/interests',
      providesTags: ['Interest'],
    }),
    updateInterests: builder.mutation<any, string[]>({
      query: (interests) => ({
        url: '/profile/interests',
        method: 'PUT',
        body: { interests },
      }),
      invalidatesTags: ['Profile'],
    }),
    addPhoto: builder.mutation<any, string>({
      query: (url) => ({
        url: '/profile/photos',
        method: 'POST',
        body: { url },
      }),
      invalidatesTags: ['Profile'],
    }),
    upgradeSubscription: builder.mutation<any, { membershipTier: 'Gold' | 'VIP' }>({
      query: ({ membershipTier }) => ({
        url: '/profile/subscription',
        method: 'POST',
        body: { membershipTier },
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteMyAccount: builder.mutation<any, void>({
      query: () => ({
        url: '/users/me',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetQuestionsQuery,
  useSubmitPersonalityMutation,
  useGetInterestsQuery,
  useUpdateInterestsMutation,
  useAddPhotoMutation,
  useUpgradeSubscriptionMutation,
  useDeleteMyAccountMutation,
} = profileApi;
