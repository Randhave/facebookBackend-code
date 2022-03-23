import express from 'express'
import { acceptReqeust, addFriend, uploadPost, deletePost, deleteFriend, getAllPosts, allFriend, deleteUser, friendProfile, getUser, login, logout, newUser, loadUser } from '../controller/uesrController.js'
import { isAuthenticated } from '../middleware/auth.js';

const userRoutes = express.Router()

userRoutes.post("/new", newUser);

userRoutes.post("/login", login)

userRoutes.post("/logout", logout)

userRoutes.get("/myprofile", isAuthenticated, getUser)

userRoutes.get("/loadUser", isAuthenticated, loadUser)

userRoutes.get("/friend/list", isAuthenticated, allFriend)

userRoutes.delete("/profile/delete", isAuthenticated, deleteUser)

userRoutes.post("/friend/sendRequest", isAuthenticated, addFriend)

userRoutes.post("/friend/acceptRequest", isAuthenticated, acceptReqeust)

userRoutes.post("/friend/delete", isAuthenticated, deleteFriend)

userRoutes.get("/friend/profile/:friendId", isAuthenticated, friendProfile)

userRoutes.put("/post/image", isAuthenticated, uploadPost)

userRoutes.get("/post/all", isAuthenticated, getAllPosts)

userRoutes.delete("/post/delete", isAuthenticated, deletePost)


export default userRoutes