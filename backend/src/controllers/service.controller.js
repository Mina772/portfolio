import createFactory from "../services/factory.service.js";
import Service from "../models/Service.js";

const factory = createFactory(Service, {
  entity: "Service",
  searchFields: ["title", "description"],
});

export const getServices = factory.getAll;
export const getService = factory.getOne;
export const createService = factory.createOne;
export const updateService = factory.updateOne;
export const deleteService = factory.deleteOne;
