import createFactory from "../services/factory.service.js";
import Education from "../models/Education.js";

const factory = createFactory(Education, {
  entity: "Education",
  searchFields: ["institution", "degree", "field"],
});

export const getEducations = factory.getAll;
export const getEducation = factory.getOne;
export const createEducation = factory.createOne;
export const updateEducation = factory.updateOne;
export const deleteEducation = factory.deleteOne;
