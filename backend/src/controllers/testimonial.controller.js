import createFactory from "../services/factory.service.js";
import Testimonial from "../models/Testimonial.js";

const factory = createFactory(Testimonial, {
  entity: "Testimonial",
  searchFields: ["name", "company", "quote"],
});

export const getTestimonials = factory.getAll;
export const getTestimonial = factory.getOne;
export const createTestimonial = factory.createOne;
export const updateTestimonial = factory.updateOne;
export const deleteTestimonial = factory.deleteOne;
