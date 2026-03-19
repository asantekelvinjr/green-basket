// backend/data/dummyProducts.js
const dummyProducts = [
  {
    name: "Potato 500g",
    category: "Vegetables",
    price: 10,
    offerPrice: 8,
    image: ["potato_image_1.png", "potato_image_2.png","potato_image_3.png","potato_image_4.png"],
    description: [
      "Fresh and organic",
      "Rich in carbohydrates",
      "Ideal for curries and fries"
    ],
    inStock: true
  },
  {
    name: "Tomato 1 kg",
    category: "Vegetables",
    price: 25,
    offerPrice: 20,
    image: ["tomato_image.png","tomato_image_2.png"],
    description: [
      "Juicy and ripe",
      "Rich in Vitamin C",
      "Perfect for salads and sauces"
    ],
    inStock: true
  }
  // Add more products here
];

export default dummyProducts;
