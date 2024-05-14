import Stripe from "stripe";
import config from "../config/config.js";

export default class StripePayment {
  constructor() {
    this.stripe = new Stripe(config.stripeSK);
  }

  createPaymentIntent = async (data) => {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create(data);
      return paymentIntent;
    } catch (error) {
      throw error;
    }
  };
}
