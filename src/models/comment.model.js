'use strict'

const { Schema, model } = require('mongoose');

const DOCUCMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const commentSchema = new Schema({
    comment_productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    comment_userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    comment_content: { type: String, default: '' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DUCUMENT_NAME },
    isDelete:{ type: Boolean, default: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUCMENT_NAME, commentSchema);