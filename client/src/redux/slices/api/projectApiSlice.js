import { apiSlice } from "../apiSlice";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: "/project",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: "/project",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const { useGetProjectsQuery, useCreateProjectMutation } = projectApiSlice;
