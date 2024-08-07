const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  const products = await Product.findAll({
    include: [
      Category,
      {
        model: Tag, through: ProductTag, as: 'tags'
      }
    ]
  })
  res.json(products)
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id, {
    include: [
      Category,
      {
        model: Tag, through: ProductTag, as: 'tags'
      }
    ]
  })
  res.json(product);
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', async (req, res) => {
  const formData = req.body;
  const product = await Product.create(formData);
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
    */
  res.json({
    message: 'Product created successfully!',
    product: product
  });

  //   Product.create(req.body)
  //      .then((product) => {
  //       // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  //       // if (req.body.tagIds.length) {
  //       //   const productTagIdArr = req.body.tagIds.map((tag_id) => {
  //       //     return {
  //       //       product_id: product.id,
  //       //       tag_id,
  //       //     };
  //       //   });
  //       //   return ProductTag.bulkCreate(productTagIdArr);
  //       // }
  //       if (tagIds && tagIds.length) {
  //         const productTagIdArr = tagIds.map(tag_id => ({
  //           product_id: product.id,
  //           tag_id
  //         }));
  //         return ProductTag.bulkCreate(productTagIdArr);
  //       }


  //       // if no product tags, just respond
  //       res.status(200).json(product);
  //     })
  //     .then((productTagIds) => res.status(200).json(productTagIds))
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(400).json(err);
  //     });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  await Product.destroy({
    where: {
      id: req.params.id
    }
  })
  res.json({
    message: 'Product Deleted Successfully'
  })
});

module.exports = router;
