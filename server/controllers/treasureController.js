//In this step, we will set up a get endpoint to retrieve the dragon's treasure. 
//This endpoint is meant to be accessible to any user of the application regardless of whether they are logged in or not.

module.exports = {
    dragonTreasure: async (req, res) => {
        const db = req.app.get('db');
        const dragonTreasure = await db.get_dragon_treasure(1)
        return res.status(200).send(dragonTreasure)
    },

    getUserTreasure: async (req, res) => {
        const db = req.app.get('db');
        const userTreasure = await db.get_user_treasure([req.session.user.id])
        return res.status(200).send(userTreasure)
    },

    addUserTreasure: async (req, res) => {
        const db = req.app.get('db');
        const {treasureURL} = req.body
        const {id} = req.session.user
        const addUserTreasure = await db.add_user_treasure([treasureURL, +id])
        return res.status(200).send(addUserTreasure)
    },

    getAllTreasure: async (req, res) => {
        const db = req.app.get('db');
        const allTreasure = await db.get_all_treasure()
        return res.status(200).send(allTreasure)
    }
}