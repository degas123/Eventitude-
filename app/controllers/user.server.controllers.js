const Users = require("../models/user.server.models");
const Joi = require("joi");
const reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\%\^\&\*\(\)\-\+\!]).{4,20}$");
const letters = new RegExp("^[a-zA-Z]+$")


// GET (/users)
const create_account = (req, res) => {

    const schema = Joi.object({
        first_name: Joi.string().min(1).alphanum().pattern(letters).required(),
        last_name: Joi.string().min(1).alphanum().pattern(letters).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().regex(reg).required()

    })
    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(
        { "error_message": error.details[0].message }
    );
    let users = Object.assign({}, req.body);

    Users.create_account(users, (err, user) => {
        console.log(err)
        if (err) {
            if (err.errno == 19) {// sqlite error for the duplication of a email adderss.(primery key)
                return res.status(400).send({ "error_message": `Email '${users.email}' already has an account.` });
            }
            else {
                return res.sendStatus(500);
            }
        }
        return res.status(201).send(user);
    })
}


const login = (req, res) => {

    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ "error_message": error.details[0].message })

    Users.authenticateUser(req.body.email, req.body.password, (err, id) => {
        if (err === 404) return res.status(400).send({ "error_message": "Invalid email/Password supplied" })
        if (err) return res.sendStatus(500)

        Users.getToken(id, (err, token) => {
            if (err) return res.sendStatus(500)
            
            if (token) {
                return res.status(200).send({ user_id: id, session_token: token })
            } else {
                Users.setToken(id, (err, token) => {
                    if (err) return res.sendStatus(500)
                    return res.status(200).send({ user_id: id, session_token: token })


                })
            }
        })
    })

}

const logout = (req, res) => {
    let token = req.get("X-Authorization");
    Users.getIdFromToken(token, function (err, id) {
        if (!id) {
            return res.sendStatus(401);
        }
        if (err) return res.sendStatus(500);
        Users.removeToken(token, (err) => {
            console.log(err);
            if (err) {
                return res.sendStatus(500);

            } else {
                return res.sendStatus(200);
            }
        });
    })


}



module.exports = {
    create_account: create_account,
    login: login,
    logout: logout

};