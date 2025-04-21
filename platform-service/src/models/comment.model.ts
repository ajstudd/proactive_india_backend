import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
    project: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    replies: mongoose.Schema.Types.ObjectId[];
    parentComment: mongoose.Schema.Types.ObjectId;
    likes: mongoose.Schema.Types.ObjectId[];
    dislikes: mongoose.Schema.Types.ObjectId[];
}

const commentSchema = new Schema<IComment>(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

// Check if the model exists before creating it to prevent OverwriteModelError
const Comment =
    mongoose.models.Comment ||
    mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
