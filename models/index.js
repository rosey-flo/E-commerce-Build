// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');



//One to Many association
Category.hasMany(Product, {
  foreignKey: 'category_id',
  // as: 'products'
});


// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  // as: 'category'
});


Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  otherKey: 'tag_id',
  as: 'tags'
});
  
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
  otherKey: 'product_id',
  as: 'products'
});



module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
