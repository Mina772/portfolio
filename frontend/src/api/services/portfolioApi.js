import { apiSlice } from "../apiSlice";

/** Serialize a params object into a query string, skipping empty values. */
const qs = (params = {}) => {
  const clean = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  return clean.length ? `?${new URLSearchParams(clean).toString()}` : "";
};

/**
 * All portfolio content endpoints (projects, skills, experience, etc.).
 * Grouped in one injection for a shared cache; hooks exported at the bottom.
 */
export const portfolioApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Projects ----------
    getProjects: builder.query({
      query: (params) => `/projects${qs(params)}`,
      providesTags: ["Project"],
    }),
    getAdminProjects: builder.query({
      query: (params) => `/projects/admin/all${qs(params)}`,
      providesTags: ["Project"],
    }),
    getFeaturedProjects: builder.query({
      query: () => "/projects/featured",
      providesTags: ["Project"],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (r, e, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: ["Project", "Dashboard"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/projects/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Project", "Dashboard"],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Project", "Dashboard"],
    }),
    uploadProjectImages: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/projects/${id}/images`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Project"],
    }),

    // ---------- About ----------
    getAbout: builder.query({ query: () => "/about", providesTags: ["About"] }),
    updateAbout: builder.mutation({
      query: (body) => ({ url: "/about", method: "PUT", body }),
      invalidatesTags: ["About"],
    }),
    uploadAboutImages: builder.mutation({
      query: (formData) => ({ url: "/about/images", method: "POST", body: formData }),
      invalidatesTags: ["About"],
    }),

    // ---------- Skills ----------
    getSkills: builder.query({
      query: (params) => `/skills${qs(params)}`,
      providesTags: ["Skill"],
    }),
    createSkill: builder.mutation({
      query: (body) => ({ url: "/skills", method: "POST", body }),
      invalidatesTags: ["Skill", "Dashboard"],
    }),
    updateSkill: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/skills/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Skill"],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({ url: `/skills/${id}`, method: "DELETE" }),
      invalidatesTags: ["Skill", "Dashboard"],
    }),

    // ---------- Experience ----------
    getExperiences: builder.query({
      query: (params) => `/experiences${qs(params)}`,
      providesTags: ["Experience"],
    }),
    createExperience: builder.mutation({
      query: (body) => ({ url: "/experiences", method: "POST", body }),
      invalidatesTags: ["Experience"],
    }),
    updateExperience: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/experiences/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Experience"],
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({ url: `/experiences/${id}`, method: "DELETE" }),
      invalidatesTags: ["Experience"],
    }),

    // ---------- Education ----------
    getEducations: builder.query({
      query: (params) => `/education${qs(params)}`,
      providesTags: ["Education"],
    }),
    createEducation: builder.mutation({
      query: (body) => ({ url: "/education", method: "POST", body }),
      invalidatesTags: ["Education"],
    }),
    updateEducation: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/education/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Education"],
    }),
    deleteEducation: builder.mutation({
      query: (id) => ({ url: `/education/${id}`, method: "DELETE" }),
      invalidatesTags: ["Education"],
    }),

    // ---------- Certificates ----------
    getCertificates: builder.query({
      query: (params) => `/certificates${qs(params)}`,
      providesTags: ["Certificate"],
    }),
    createCertificate: builder.mutation({
      query: (body) => ({ url: "/certificates", method: "POST", body }),
      invalidatesTags: ["Certificate", "Dashboard"],
    }),
    updateCertificate: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/certificates/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Certificate"],
    }),
    deleteCertificate: builder.mutation({
      query: (id) => ({ url: `/certificates/${id}`, method: "DELETE" }),
      invalidatesTags: ["Certificate", "Dashboard"],
    }),

    // ---------- Services ----------
    getServices: builder.query({
      query: (params) => `/services${qs(params)}`,
      providesTags: ["Service"],
    }),
    createService: builder.mutation({
      query: (body) => ({ url: "/services", method: "POST", body }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/services/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({ url: `/services/${id}`, method: "DELETE" }),
      invalidatesTags: ["Service"],
    }),

    // ---------- Testimonials ----------
    getTestimonials: builder.query({
      query: (params) => `/testimonials${qs(params)}`,
      providesTags: ["Testimonial"],
    }),
    createTestimonial: builder.mutation({
      query: (body) => ({ url: "/testimonials", method: "POST", body }),
      invalidatesTags: ["Testimonial"],
    }),
    updateTestimonial: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/testimonials/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Testimonial"],
    }),
    deleteTestimonial: builder.mutation({
      query: (id) => ({ url: `/testimonials/${id}`, method: "DELETE" }),
      invalidatesTags: ["Testimonial"],
    }),

    // ---------- Blog ----------
    getPosts: builder.query({
      query: (params) => `/blog${qs(params)}`,
      providesTags: ["Blog"],
    }),
    getAdminPosts: builder.query({
      query: (params) => `/blog/admin/all${qs(params)}`,
      providesTags: ["Blog"],
    }),
    getPost: builder.query({
      query: (id) => `/blog/${id}`,
      providesTags: (r, e, id) => [{ type: "Blog", id }],
    }),
    createPost: builder.mutation({
      query: (body) => ({ url: "/blog", method: "POST", body }),
      invalidatesTags: ["Blog", "Dashboard"],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/blog/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Blog"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({ url: `/blog/${id}`, method: "DELETE" }),
      invalidatesTags: ["Blog", "Dashboard"],
    }),

    // ---------- Messages ----------
    sendMessage: builder.mutation({
      query: (body) => ({ url: "/messages", method: "POST", body }),
    }),
    getMessages: builder.query({
      query: (params) => `/messages${qs(params)}`,
      providesTags: ["Message"],
    }),
    updateMessageStatus: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/messages/${id}/status`, method: "PATCH", body }),
      invalidatesTags: ["Message", "Dashboard"],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({ url: `/messages/${id}`, method: "DELETE" }),
      invalidatesTags: ["Message", "Dashboard"],
    }),

    // ---------- Dashboard & uploads ----------
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    uploadFile: builder.mutation({
      query: (formData) => ({ url: "/upload", method: "POST", body: formData }),
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetAdminProjectsQuery,
  useGetFeaturedProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadProjectImagesMutation,
  useGetAboutQuery,
  useUpdateAboutMutation,
  useUploadAboutImagesMutation,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useGetEducationsQuery,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useGetCertificatesQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetPostsQuery,
  useGetAdminPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useSendMessageMutation,
  useGetMessagesQuery,
  useUpdateMessageStatusMutation,
  useDeleteMessageMutation,
  useGetDashboardStatsQuery,
  useUploadFileMutation,
} = portfolioApi;
