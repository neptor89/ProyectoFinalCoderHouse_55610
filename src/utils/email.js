import nodemailer from "nodemailer";
import config from "../config/config.js";
import __dirname from "../utils/path.js";
import logger from "../utils/logger.js";
import { productModel } from "../services/dao/models/product.model.js";

//Transport config
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmailAccount,
    pass: config.gmailAppPassword,
  },
});

//Gmail connection verification
transporter.verify(function (error, success) {
  if (error) {
    logger.info(error);
  } else {
    logger.info("Server is ready to take our messages");
  }
});

export const sendEmailWithTicket = async (email, ticket) => {
  try {
    // Retrieve product details
    const productsDetails = await Promise.all(
      ticket.products.map(async (product) => {
        const productInfo = await productModel.findById(product.productId);
        return {
          title: productInfo.title,
          thumbnail: productInfo.thumbnails[0],
          quantity: product.quantity,
        };
      })
    );

    const productCards = productsDetails
      .map(
        (product) => `
      <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
        <h3>${product.title}</h3>
        <img src="${product.thumbnail}" alt="${product.title}" style="max-width: 100px; height: auto;">
        <p>Quantity: ${product.quantity}</p>
      </div>
    `
      )
      .join("");

    const mailOptions = {
      from: "Ecommerce - " + config.gmailAccount,
      to: email,
      subject: "Order Confirmation",
      html: `<div>
                <h1>Your Order Details</h1>
                <p>Order ID: ${ticket._id}</p>
                <p>Total Amount: ${ticket.amount}</p>
                <p>Purchased Products:</p>
                ${productCards}
            </div>
            <div>
            <p>Thanks for trusting us, hope to hear from you soon!</p>
            </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    logger.info("Order confirmation email sent to: " + email);
  } catch (error) {
    logger.warning("Error sending email:", error);
    throw new Error("Error sending email: " + error.message);
  }
};

export const sendResetPasswordEmail = async (email, token) => {
  try {
    const mailOptions = {
      from: "Reset Password - " + config.gmailAccount,
      to: email,
      subject: "Reset your password",
      html: `
  <div 
    style="max-width: 400px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 10px; text-align: center;">
    <h1 style="color: #333;">Reset your password</h1>
    <p style="margin-top: 20px; font-size: 16px;">Click the link below to reset your password:</p>
    <a href="https://becoderhousefinalproject-production.up.railway.app/updatepassword?token=${token}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #000000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p style="margin-top: 20px; font-size: 14px; color: #666;">Please note that you cannot use the same password you previously had to reset your password.</p>
    <p style="font-size: 14px; color: #666;">This password reset link is valid for 1 hour.</p>
  </div>
    `,
    };
    await transporter.sendMail(mailOptions);
    logger.info("Reset password email sent to: " + email);
  } catch (error) {
    logger.warning("Error sending email:", error);
    throw new Error("Error sending email: " + error.message);
  }
};

export const sendDeleteProductEmail = async (email, product) => {
  try {
    const mailOptions = {
      from: "Ecommerce - " + config.gmailAccount,
      to: email,
      subject: "Product Deleted",
      html: `
        <div>
          <h1>Your Product Has Been Deleted</h1>
          <p>The following product has been deleted from our ecommerce platform:</p>
          <ul>
            <li>Title: ${product.title}</li>
            <li>Description: ${product.description}</li>
            <li>Code: ${product.code}</li>
            <li>Price: ${product.price}</li>
            <li>Category: ${product.category}</li>
          </ul>
          <p>We apologize for any inconvenience this may cause. If you have any questions or concerns, feel free to contact us.</p>
          <p>Thank you for your understanding.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info("Delete product email sent to: " + email);
  } catch (error) {
    logger.warning("Error sending email:", error);
    throw new Error("Error sending email: " + error.message);
  }
};

export const sendDeleteInactiveUserEmail = async (email) => {
  try {
    const mailOptions = {
      from: "Ecommerce - " + config.gmailAccount,
      to: email,
      subject: "Account Deletion Due to Inactivity",
      html: `
        <div>
          <h1>Your Account Has Been Deleted Due to Inactivity</h1>
          <p>We regret to inform you that your account has been deleted from our ecommerce platform due to inactivity.</p>
          <p>If you wish to continue using our services, please feel free to register again.</p>
          <p>If you believe this deletion was made in error or if you have any questions, please contact us.</p>
          <p>Thank you for your understanding.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info("Inactive user deletion email sent to: " + email);
  } catch (error) {
    logger.warning("Error sending email:", error);
    throw new Error("Error sending email: " + error.message);
  }
};
