
const router = require("express").Router();

router.get('/heath', (_req, res) => {
   res.status(200).json({ message: 'Success' });
})


module.exports = router;
