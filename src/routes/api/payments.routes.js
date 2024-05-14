import { Router } from "express";
import { authorization } from "../../utils/auth.js";
import { passportCall } from "../../utils/passport.js";
import PaymentsController from "../../controllers/paymentsControllers.js";
import StripePayment from "../../utils/stripePayment.js";
import PaymentService from "../../services/dao/payment.service.js";

const router = Router();
const stripePayment = new StripePayment();
const paymentService = new PaymentService({ StripePayment: stripePayment });
const paymentsControllers = new PaymentsController({
  PaymentService: paymentService,
});

router.post(
  "/:ticketId/purchase",
  passportCall("jwt"),
  authorization(["user", "premium"]),
  async (req, res, next) => {
    try {
      await paymentsControllers.makePurchase(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
