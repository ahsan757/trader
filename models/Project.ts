import mongoose, { Schema, model, models } from 'mongoose';

const PaymentSchema = new Schema({
    type: { type: String, enum: ['cash', 'online'], required: true },
    date: { type: Date, required: true },
    itemOfPayment: { type: String, required: true },
    amount: { type: Number, required: true },
});

const ItemSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    quantityPerPcs: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
});

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    buyItems: [ItemSchema],
    buyPayments: [PaymentSchema],
    giveItems: [ItemSchema],
    givePayments: [PaymentSchema],
    createdAt: { type: Date, default: Date.now },
});

export const Project = models.Project || model('Project', ProjectSchema);
