const { isEmail } = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')



const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: [true, 'This field is required'],
        lowercase: true
    },
    lastname:{
        type: String,
        required: [true, 'This field is required'],
        lowercase: true
    },
    email:{
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate:[isEmail, 'Pls enter a avalid email']
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength:[8, 'Minimum of eight characters']
    }
})


userSchema.pre('save', async function(next){
    const salt =await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// ======== login static middilewear ================
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email })
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        
        if(auth){
            return user
        }
        throw error('incorrect password')
    }
    throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema)
module.exports = User