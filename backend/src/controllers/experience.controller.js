import createFactory from "../services/factory.service.js";
import Experience from "../models/Experience.js";

const factory = createFactory(Experience, {
  entity: "Experience",
  searchFields: ["company", "position", "technologies"],
});

export const getExperiences = factory.getAll;
export const getExperience = factory.getOne;
export const createExperience = factory.createOne;
export const updateExperience = factory.updateOne;
export const deleteExperience = factory.deleteOne;
