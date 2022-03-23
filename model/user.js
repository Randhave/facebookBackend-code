import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    request: [
        {
            status: {
                type: Boolean,
                default: false
            },
            userId: {
                type: String,
                default: null
            },
            name: {
                type: String,
                default: null
            }
        }
    ],
    friendList: [
        {
            userId: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
        }
    ],
    numberofFriend: {
        type: Number,
        default: 0,
        required: true
    },
    posts: [

        {
            public_id: {
                type: String,

            },
            url: {
                type: String,

            }
        },

    ]
})

// bcrypt password before save in database
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10);
})

// create jsonwebtoken
userSchema.methods.generateToken = function (next) {
    return jwt.sign({ id: this._id }, process.env.PRIVATE_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}



const User = new mongoose.model("User", userSchema);

export default User;
