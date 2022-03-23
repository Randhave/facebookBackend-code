const sendToken = async (user, statusCode, res) => {
    const token = await user.generateToken();

    // options for console
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        credentials: 'include',
        withCredentials: true,

        httpOnly: true     // it means token also save on localhost server
    }
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    });
};

export default sendToken 