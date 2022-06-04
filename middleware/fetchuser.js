const jwt = require('jsonwebtoken');

const JWT_SECRET = 'an$ab_fahad_a$fand_ba$it_skinnoir_final_project'


const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send("Invalid token")
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send("Invalid token")
    }

}


module.exports = fetchUser;