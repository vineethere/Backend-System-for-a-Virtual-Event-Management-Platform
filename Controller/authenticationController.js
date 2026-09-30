const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const SALT_ROUNDS = 10;
const { UsersData } = require('../Modal/UserModal')
// const UsersData = [
//   { username: "user1", password: "password1", email: "user1@example.com" },
//   { username: "user2", password: "password2", email: "user2@example.com" },
//   { username: "user3", password: "password3", email: "user3@example.com" },
//   { username: "user4", password: "password4", email: "user4@example.com" },
//   { username: "vineet", password: "password", email: "vineet@example.com" } 
// ];
const checkLoginCredentials = async (username, password) => {

    const JWT_SECRET = process.env.JWT_SECRET;
    const dbUser = UsersData.filter(i => i.username === username)[0]
    if (!dbUser) throw new Error("User didn't exist");
    const dbPassword = dbUser.password;
    isPasswordSame = await bcrypt.compare(password, dbPassword);
    if (!isPasswordSame) throw new Error('Password is  Wrong pls check');
    const payload = { "username": username, "email": dbUser.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return { status: "ok", token };
}
const isSuccessfullyRegistered = async (body) => {
    if (!body) {
        return "Request body is missing";
    }
    let { username, password, email } = body;
    let error = "";
    try {
        if (!username) error = "UserName is required";
        else if (!password) error = "password is required to register";
        else if (!email) error = "email is required to register";
        else {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            UsersData.push({
                username: username,
                password: hashedPassword,
                email: email
            })
        }

        return error;
    }
    catch (e) {
        return e.message;
    }




}

module.exports = { checkLoginCredentials, isSuccessfullyRegistered };