const bcrypt = require('bcrypt');

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const {username, password, isAdmin} = req.body
        const result = await db.get_user([username])
        const existingUser = result[0]
        if(existingUser){
            return res.status(409).send('Username taken')
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const registeredUser = await db.register_user([isAdmin, username, hash])
        const user = registeredUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            username: user.username,
            id: user.id,

        }
        res.status(201).send(req.session.user)
    },

    login: async (req, res) => {
        const db = req.app.get('db') //Get the database instance
        const {username, password} = req.body
        const foundUser = await db.get_user([username])
        const user = foundUser[0]
        if(!user){
            return res.status(401).send('User not found. Please register as a new user before logging in.')
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash)
        //This method compares the password entered by the user at login to the hashed and salted version stored in the database.
        if(!isAuthenticated){
            return res.status(403).send('Incorrect password')
        }else{
            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username         
            }
            return res.status(200).send(req.session.user);
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        //As the name implies, this destroys the data stored on the user's session object, 
        //effectively logging the user out.

        res.sendStatus(200)
    }












}