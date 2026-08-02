import createFactory from "../services/factory.service.js";
import Skill from "../models/Skill.js";

const factory = createFactory(Skill, {
  entity: "Skill",
  searchFields: ["name"],
});

export const getSkills = factory.getAll;
export const getSkill = factory.getOne;
export const createSkill = factory.createOne;
export const updateSkill = factory.updateOne;
export const deleteSkill = factory.deleteOne;
