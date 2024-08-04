import { faker } from "@faker-js/faker";

export const generateMockProducts = (num = 100) => {
  const products = [];
  for (let i = 0; i < num; i++) {
    products.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      stock: 500,
      category: faker.commerce.department(),
    });
  }
  return products;
};
