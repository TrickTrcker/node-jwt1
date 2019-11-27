const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({
                    error: "Invalid email Id."
                });
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    token: [{
        token: {
            type: String,
            required: true
        }
    }]
});
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({
        _id: user._id
    }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}
userSchema.statics.findByCrendentials = async (email, password) => {
    debugger;
    const user = await User.findOne({
        email
    });
    if (!user) {
        throw new Error({
            error: "invalid email id"
        });
    }
    const ismatched = bcrypt.compare(password,user.password);
    if(! ismatched){
        throw new Error({
            error : "invalid password"
        });
    }
    return user;
}

const User = mongoose.model('User',userSchema);
module.exports=User;