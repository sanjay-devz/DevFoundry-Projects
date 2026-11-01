import test from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import ClothingItem from '../models/ClothingItem.js'
import Outfit from '../models/Outfit.js'
import MaintenanceTask from '../models/MaintenanceTask.js'

const user = new mongoose.Types.ObjectId()

test('clothing items validate required owner and wardrobe fields', () => {
  const valid = new ClothingItem({ user, name: 'Linen shirt', category: 'Shirts', color: 'Cream', colorHex: '#FAF7EE' })
  assert.equal(valid.validateSync(), undefined)
  const invalid = new ClothingItem({ user, name: 'Linen shirt', category: 'Furniture', color: 'Cream', colorHex: 'cream' })
  const error = invalid.validateSync()
  assert.ok(error.errors.category)
  assert.ok(error.errors.colorHex)
})

test('outfits and care tasks require valid references and statuses', () => {
  const outfit = new Outfit({ user, name: 'Everyday', items: [new mongoose.Types.ObjectId()] })
  assert.equal(outfit.validateSync(), undefined)
  const task = new MaintenanceTask({ user, clothingItem: new mongoose.Types.ObjectId(), taskType: 'Wash', dueDate: new Date() })
  assert.equal(task.validateSync(), undefined)
  task.status = 'Skipped'
  assert.ok(task.validateSync().errors.status)
})
