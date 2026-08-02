import createFactory from "../services/factory.service.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { fileToAsset } from "../middlewares/upload.js";
import Certificate from "../models/Certificate.js";

const factory = createFactory(Certificate, {
  entity: "Certificate",
  searchFields: ["title", "organization", "skills"],
});

export const getCertificates = factory.getAll;
export const getCertificate = factory.getOne;
export const createCertificate = factory.createOne;
export const updateCertificate = factory.updateOne;
export const deleteCertificate = factory.deleteOne;

/** POST /certificates/:id/image - upload certificate image. */
export const uploadCertificateImage = catchAsync(async (req, res) => {
  const cert = await Certificate.findById(req.params.id);
  if (!cert) throw ApiError.notFound("Certificate not found");
  if (req.file) cert.image = fileToAsset(req.file);
  await cert.save();
  sendResponse(res, 200, cert, "Certificate image uploaded");
});
