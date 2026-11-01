export function crudController(Model, { fields, populate = '', query = () => ({}), sort = () => ({ createdAt: -1 }), prepare = async (body) => body, beforeDelete = async () => {}, afterUpdate = null } = {}) {
  const safeFields = (body) => Object.fromEntries(fields.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]))
  return {
    list: async (req, res, next) => {
      try {
        const filter = { user: req.user.id, ...query(req) }
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
        const limit = Math.min(60, Math.max(1, Number.parseInt(req.query.limit, 10) || 24))
        const [items, total] = await Promise.all([
          Model.find(filter).populate(populate).sort(sort(req)).skip((page - 1) * limit).limit(limit),
          Model.countDocuments(filter),
        ])
        res.json({ success: true, data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } })
      } catch (error) { next(error) }
    },
    create: async (req, res, next) => {
      try {
        const values = await prepare(safeFields(req.body), req.user)
        const item = await Model.create({ ...values, user: req.user.id })
        await item.populate(populate)
        res.status(201).json({ success: true, data: { item } })
      } catch (error) { next(error) }
    },
    get: async (req, res, next) => {
      try {
        const item = await Model.findOne({ _id: req.params.id, user: req.user.id }).populate(populate)
        if (!item) return res.status(404).json({ success: false, message: 'Record not found.' })
        res.json({ success: true, data: { item } })
      } catch (error) { next(error) }
    },
    update: async (req, res, next) => {
      try {
        const values = await prepare(safeFields(req.body), req.user, req.params.id)
        const previous = afterUpdate ? await Model.findOne({ _id: req.params.id, user: req.user.id }).select('cloudinaryPublicId') : null
        const item = await Model.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { $set: values }, { new: true, runValidators: true }).populate(populate)
        if (!item) return res.status(404).json({ success: false, message: 'Record not found.' })
        if (afterUpdate) await afterUpdate(previous, item, values, req.user)
        res.json({ success: true, data: { item } })
      } catch (error) { next(error) }
    },
    remove: async (req, res, next) => {
      try {
        const item = await Model.findOne({ _id: req.params.id, user: req.user.id })
        if (!item) return res.status(404).json({ success: false, message: 'Record not found.' })
        await beforeDelete(item, req.user)
        await item.deleteOne()
        res.json({ success: true, data: { message: 'Record deleted.' } })
      } catch (error) { next(error) }
    },
  }
}
