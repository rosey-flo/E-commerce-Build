const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async(req, res) => {
  // find all tags
  // be sure to include its associated Product data
  const tags = await Tag.findAll({
    include: [
      { model: Product, through: ProductTag, as: 'products' }
    ]
  });
  res.json(tags);
});

router.get('/:id', async(req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const tag = await Tag.findByPk(req.params.id, {
    include: [
      { model: Product, through: ProductTag, as: 'products' }
    ]
  })
  res.json(tag);
});

router.post('/', async(req, res) => {
  // create a new tag
  const tag = await Tag.create(req.body);
    res.json({
      message: 'Tag created successfully!',
      tag
    });
});

router.put('/:id', async(req, res) => {
  // update a tag's name by its `id` value
  const tag = await Tag.update(
    req.body,
    {
      where: {
        id: req.params.id
      },
      returning: true,
    }
  )
  res.json(tag) 
});

router.delete('/:id', async(req, res) => {
  // delete on tag by its `id` value
  await Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  res.json({
    message: 'Tag Deleted Successfully'
  })
  await ProductTag.destroy({
    where: {
      tag_id: req.params.id
    }
  });
  res.json({
    message: 'Subsequent Product-tag Deleted Successfully'
  })
});

module.exports = router;
