import assert from 'node:assert/strict'
import test from 'node:test'

import {
  clampSignatureStampPosition,
  DEFAULT_SIGNATURE_STAMP_SIZE,
  getSignatureStampDomRect,
  getSignatureStampDomSize,
  toPdfSignaturePlacement,
} from '../../app/modules/document-signing/model/signature-stamp.ts'

const viewport = {
  width: 750,
  height: 1000,
  scale: 1.25,
}

test('default signature stamp keeps prototype PDF-point dimensions', () => {
  assert.deepEqual(DEFAULT_SIGNATURE_STAMP_SIZE, {
    width: 180,
    height: 60,
  })
})

test('stamp PDF-point dimensions are scaled for DOM rendering', () => {
  assert.deepEqual(
    getSignatureStampDomSize(
      { width: 180, height: 60 },
      1.25,
    ),
    { width: 225, height: 75 },
  )
})

test('stamp position is constrained to the rendered page bounds', () => {
  assert.deepEqual(
    clampSignatureStampPosition(
      { x: -20, y: 1200 },
      { width: 180, height: 60 },
      viewport,
    ),
    { x: 0, y: 925 },
  )

  assert.deepEqual(
    clampSignatureStampPosition(
      { x: 900, y: -10 },
      { width: 180, height: 60 },
      viewport,
    ),
    { x: 525, y: 0 },
  )
})

test('oversized stamp is anchored to the page origin', () => {
  assert.deepEqual(
    clampSignatureStampPosition(
      { x: 100, y: 100 },
      { width: 1000, height: 1000 },
      viewport,
    ),
    { x: 0, y: 0 },
  )
})

test('DOM rect combines clamped position and scaled size', () => {
  assert.deepEqual(
    getSignatureStampDomRect(
      { x: 600, y: 950 },
      { width: 180, height: 60 },
      viewport,
    ),
    {
      x: 525,
      y: 925,
      width: 225,
      height: 75,
    },
  )
})

test('top-left DOM coordinates convert to bottom-left PDF points', () => {
  assert.deepEqual(
    toPdfSignaturePlacement(
      2,
      { x: 125, y: 250 },
      { width: 180, height: 60 },
      viewport,
    ),
    {
      page: 2,
      x: 100,
      y: 540,
      width: 180,
      height: 60,
    },
  )
})

test('PDF conversion uses the clamped DOM position', () => {
  assert.deepEqual(
    toPdfSignaturePlacement(
      1,
      { x: 900, y: 1200 },
      { width: 180, height: 60 },
      viewport,
    ),
    {
      page: 1,
      x: 420,
      y: 0,
      width: 180,
      height: 60,
    },
  )
})

test('invalid geometry is rejected explicitly', () => {
  assert.throws(
    () => getSignatureStampDomSize(
      { width: 0, height: 60 },
      1,
    ),
    /stamp width/,
  )

  assert.throws(
    () => toPdfSignaturePlacement(
      0,
      { x: 0, y: 0 },
      { width: 180, height: 60 },
      viewport,
    ),
    /page/,
  )
})
