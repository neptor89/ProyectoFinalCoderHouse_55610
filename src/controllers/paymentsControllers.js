export default class PaymentsController {
  constructor({ PaymentService }) {
    this.paymentService = PaymentService;
  }
  makePurchase = async (req, res, next) => {
    try {
      const { ticketId } = req.params;
      const paymentIntent = await this.paymentService.createPaymentIntent(
        ticketId
      );
      if (!paymentIntent) {
        throw new Error("Payment intent could not be created");
      }
      res.status(200).json({ status: "success", payload: paymentIntent });
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
