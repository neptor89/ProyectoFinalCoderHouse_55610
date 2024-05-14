import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { generateProductErrorInfo } from "../services/errors/messages/product-creation-error.message.js";
import { productsService } from "../services/service.js";
import { generateProducts } from "../utils/fakeProducts.js";
import logger from "../utils/logger.js";
import config from "../config/config.js";
import { sendDeleteProductEmail } from "../utils/email.js";

export const generateMockProductsController = async (req, res) => {
  try {
    let products = generateProducts();
    res.send({ status: "success", payload: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsController = async (req, res) => {
  const { limit, page, sort } = req.query;
  try {
    let products = await productsService.getAll(limit, page, sort);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnlimitedProductsController = async (req, res) => {
  try {
    let products = await productsService.getNoLimitProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsFromUserController = async (req, res) => {
  try {
    let uId = req.params.uid;
    let productsFromUser = await productsService.getAllFromUser(uId);
    res.json(productsFromUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductController = async (req, res) => {
  try {
    let pid = req.params.pid;
    let product = await productsService.getOne(pid);
    if (!product) {
      return res.status(404).send("No product found");
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postProductController = async (req, res) => {
  const reqProduct = req.body;
  const creatorEmail = req.user.email;
  try {
    if (
      reqProduct.title === undefined ||
      reqProduct.description === undefined ||
      reqProduct.code === undefined ||
      reqProduct.price === undefined ||
      reqProduct.stock === undefined ||
      reqProduct.category === undefined ||
      reqProduct.thumbnails === undefined
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo(reqProduct),
        message: "Invalid property error",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    reqProduct.owner = creatorEmail;
    const product = await productsService.create(reqProduct);
    res.json(product);
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      error: error.name,
      message: error.message,
      code: error.code,
    });
  }
};

export const putProductController = async (req, res) => {
  const pid = req.params.pid;
  const product = req.body;
  const productCreator = req.user;
  try {
    if (
      productCreator.email !== config.adminEmail &&
      product.owner !== productCreator.email
    ) {
      throw new Error("Not authorized to update product");
    }
    const newProduct = await productsService.update(pid, product);
    if (!product) return res.status(404).send("No product found");
    console.log(newProduct);
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductController = async (req, res) => {
  const pid = req.params.pid;
  const productCreator = req.user;
  try {
    let product = await productsService.getOne(pid);
    if (!product) return res.status(404).send("No product found");
    if (
      productCreator.email !== config.adminEmail &&
      product.owner !== productCreator.email
    ) {
      throw new Error("Not authorized to delete product");
    } else if (product.owner !== config.adminEmail) {
      sendDeleteProductEmail(product.owner, product);
    }
    await productsService.delete(pid);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
