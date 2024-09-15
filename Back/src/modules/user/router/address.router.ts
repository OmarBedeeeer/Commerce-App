import { Router } from "express";
import { addressController } from "../controller/address.controller";
import { authentecation, authorized } from "../../user/controller/user.auth";

const router: Router = Router();

router.post("/adress", authentecation, addressController.addAddress);
router.get("/adresses", authentecation, addressController.getAddresses);
router.delete(
  "/adress/:addressId",
  authentecation,
  addressController.deleteAddress
);

export default router;
