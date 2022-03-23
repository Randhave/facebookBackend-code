import User from "../model/user.js";
import sendToken from "../utils/sendToken.js";
import bcrypt from 'bcryptjs'
import cloudinary from 'cloudinary'

// import ApiFeatures from "../utils/apiFeatures.js";
import ApiFeatures from '../utils/apiFeautes.js'


export const newUser = async (req, res) => {
    try {
        const data = req.body
        const user = await new User(data);
        user.request.status = false
        user.request.userId = null
        user.save()
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `user cannont created ${error.message}`
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Invalid credentials")
        }

        const user = await User.findOne({ email: email }).select("+password");
        if (!user) {
            throw new Error("Invalid credentials ! please Try again latter")
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            throw new Error("Invalid credentials ! please Try again latter")
        };

        // here we generate token at the time of register and also save into cookie and login also
        sendToken(user, 200, res)
        console.log("successfully login .......")

    } catch (error) {
        return res.status(422).json({ success: false, message: `${error.message}` });
    }
}


export const logout = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({ success: true, message: "logged out" })
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log("successfully fetched user .........")
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Please login before getting profile"
        })
    }
}


export const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ success: true, user })
    console.log("account deleted successfully .........")
}


export const addFriend = async (req, res) => {
    try {
        // let { userId } = req.body
        // const exist = await User.findById(productId);

        // const existUsesr = prod.reviews.find((review) => {
        //     review.user.toString() === req.user._id.toString();
        // });

        // let loginUser = await User.findById(req.user.id)

        // loginUser.friendList.push({ name, email });
        // loginUser.save() 

        // const friend = {
        //     status: active,
        //     userId: req.user.userId
        // }

        // let loginUser = await User.findById(req.user.id)
        // const existFriend = loginUser.friendList.find((friend) => {
        //     friend._id.toString() == userId.toString()
        // })

        // if (existFriend) {
        //     res.json({
        //         success: false,
        //         message: "friend already exist"
        //     })
        // } else {
        //     loginUser.friendList.push(friend)
        //     loginUser.numberofFriend = loginUser.friendList.length
        // }

        let { userId } = req.body
        let newFriend = await User.findById(userId);

        console.log("friend id ", userId)
        console.log("friend request ", newFriend)

        let newRequest = {
            status: true,
            userId: req.user.id,
            name: req.user.name
        }
        newFriend.request.push(newRequest)
        newFriend.save()
        res.status(200).json({
            success: true,

            message: "request sent successfully"
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: `cannot add frined ${error.message}`
        })
    }
}

export const loadUser = async (req, res) => {
    try {
        let userData = await User.findById(req.user.id)
        res.status(200).json({
            success: true,
            userData
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: `cannot load user ${error.message}`
        })
    }
}

export const acceptReqeust = async (req, res) => {
    try {
        let loginUser = req.user
        console.log("login user ", loginUser);

        // let requstId = loginUser.request[0].userId
        // let requestStatus = loginUser.request[0].status
        let requstId = req.body.userId
        // let requestStatus = req.body.status

        // check user already friend or not
        let existFriend = loginUser.friendList.find((friend) => friend.userId.toString() === requstId.toString())
        console.log("exist friend ", existFriend);

        if (!existFriend && req.user.id !== requstId) {

            // if (requestStatus === "accept") {

            console.log("request user id ", requstId)
            // console.log("status ", requestStatus)

            let friendReuqestUser = await User.findById(requstId);

            console.log("request friend ", friendReuqestUser);




            let friend = {
                userId: friendReuqestUser._id,
                name: friendReuqestUser.name,
                email: friendReuqestUser.email
            }
            loginUser.friendList.push(friend)
            await loginUser.save()

            let loginUser_ = {
                userId: loginUser._id,
                name: loginUser.name,
                email: loginUser.email
            }
            friendReuqestUser.friendList.push(loginUser_)
            await friendReuqestUser.save()

            // set the number of friend 
            loginUser.numberofFriend = friendReuqestUser.friendList.length
            friendReuqestUser.numberofFriend = friendReuqestUser.friendList.length

            // delete request after added friend
            loginUser.request = loginUser.request.filter((req) => req.userId.toString() !== requstId.toString())

            loginUser.save()

            res.status(200).json({
                success: true,
                // existFriend,
                // loginUser,
                // friendReuqestUser,
                message: "Friend reqest accepted"

            })
            // } else {
            //     return
            // }
        } else {
            res.status(200).json({
                success: true,
                message: "friend already present in your friendList"
            })
        }
    } catch (error) {
        res.status(404).json({
            success: false,
            message: `cant accpet request ${error.message}`
        })
    }
}

export const deleteFriend = async (req, res) => {
    try {
        let userId_ = req.body.userId;  // friend to be remove from friend list

        let loginUser = await User.findById(req.user.id);
        console.log("login user ", loginUser);

        let requestUser = await User.findById(userId_);
        console.log("request user id ", requestUser._id);
        console.log("request user ", requestUser);

        if (!requestUser) {
            res.status(404).json({
                success: false,
                message: "user not found || already deleted"
            })
        }


        // loginUser.friendList = await loginUser.friendList && loginUser.friendList.filter((friend) => {
        //     friend.userId !== userId_
        // })


        // requestUser.friendList = await requestUser.friendList && requestUser.friendList.filter((friend) => {
        //     friend.userId !== req.user.id
        // })

        let friends = loginUser.friendList.filter((friend) => friend.userId !== userId_)
        loginUser.friendList = friends;
        await loginUser.save()

        let friends_ = requestUser.friendList.filter((friend) => friend.userId !== userId_)
        requestUser.friendList = friends_;
        await requestUser.save()

        res.status(200).json({
            success: true,
            loginUser
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: `cannot remove your friend in your friend list ${error.message}`
        })
    }
}

export const friendProfile = async (req, res) => {
    try {

        // let friendId = req.body.friendId
        let friendId = req.params.friendId


        let loginUser = await User.findById(req.user.id)

        let isPresent = loginUser.friendList.find((friend) => friend.userId === friendId)

        if (isPresent) {
            let user = await User.findById(friendId)
            res.status(200).json({
                success: true,
                user
            })
        } else {
            res.status(404).json({
                success: false,
                message: "You only see your friends profile"
            })
            return
        }

    } catch (error) {
        res.status(404).json({
            success: false,
            message: `cannot fetch friend data ${error.message}`
        })
    }
}

export const allFriend = async (req, res) => {
    let user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        friends: user.friendList && user.friendList
    })
}


export const uploadPost = async (req, res) => {
    try {

        let loginUser = await User.findById(req.user.id)
        let posts = []
        // console.log("files ", req.files.posts);

        const postsLink = [{}];

        let file = req.files.posts
        // console.log("using files ", file);

        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "products",
            width: 150,
            crop: "scale",
            resource_type: "auto"
        })

        postsLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })

        console.log("before save images ", loginUser.posts);

        loginUser.posts.push({
            public_id: result.public_id,
            url: result.secure_url
        })
        loginUser.save()
        // console.log("posts array ", posts);
        // console.log("postslink ", postsLink);


        res.status(200).json({
            success: true, message: "successfully updated data",
            loginUser
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: `cannot post ${error.message}`
        })
    }
}

export const getAllPosts = async (req, res) => {
    try {

        // const resultPerPage = 5;
        // let user_ = await User.findById(req.user.id)
        // const apiFeatures = new ApiFeatures(User.findById(req.user.id), req.query);
        // apiFeatures.pagination(resultPerPage);

        // user_ = await apiFeatures.query;

        let userData = await User.findById(req.user.id)
        let posts = userData.posts
        let images = [];

        posts.forEach(image => {
            images.push(image.url)
        });

        res.status(200).json({
            success: true,
            images,
            // posts ,
            // user_
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: `cannot find posts ${error.message}`
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        let postId = req.body.postId;
        let userData = await User.findById(req.user.id)

        let posts = userData.posts

        let element = posts.filter(post => post._id.toString() === postId.toString())
        if (!element) {
            res.status(404).json({
                success: false, message: `cannot find post`
            })
            return
        }
        let imagePublicId = element[0].public_id
        let removed = await cloudinary.v2.uploader.destroy(imagePublicId);
        console.log("removed ", removed);

        userData.posts = posts.filter((image) => image._id.toString() !== postId.toString())
        userData.save()

        res.status(200).json({
            success: true,
            userData
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: `cannot delete post ${error.message}`
        })
    }
}