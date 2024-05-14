import logger from "../../utils/logger.js";
import ticketModel from "./models/ticket.model.js";
import { sendEmailWithTicket } from "../../utils/email.js";

export default class PaymentService {
  constructor({ StripePayment }) {
    this.stripePayment = StripePayment;
  }
  async createPaymentIntent(id) {
    try {
      const ticket = await ticketModel.findById(id);
      const paymentData = {
        amount: ticket.amount * 100,
        currency: "usd",
        metadata: {
          purchaser: ticket.purchaser,
        },
      };

      const paymentIntent = await this.stripePayment.createPaymentIntent(
        paymentData
      );

      if (!paymentIntent) {
        logger.error("Payment intent could not be created");
      }

      await sendEmailWithTicket(ticket.purchaser, ticket);
      return paymentIntent;
    } catch (error) {
      logger.error(error.message);
    }
  }
}
