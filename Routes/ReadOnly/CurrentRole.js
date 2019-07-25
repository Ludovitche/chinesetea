const getAllCurrentRole = (pool) => (req, res, next) => {
	pool
  	.connect()
  	.then(client => {
    	return client.query('SELECT * FROM CurrentRole')
      	.then(data => {
			client.release()
			return res.json(data)
      	})
      	.catch(e => {
			client.release()
    	    console.log(err.stack)
			return res.status(400).send(e);
      	})
	})
	.catch(e => res.status(400).send(e))
}

module.exports = {
	getAllCurrentRole: getAllCurrentRole
}