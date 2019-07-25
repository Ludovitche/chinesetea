const getAllCurrentRole = (pool) => (req, res, next) => {
	pool
  	.connect()
  	.then(client => {
    	return client.query('SELECT * FROM CurrentRole')
      	.then(data => {
			client.release()
			return data.json()
      	})
      	.catch(e => {
			client.release()
    	    console.log(err.stack)
			return res.status(400).send(err);
      	})
	})
	.catch(e => res.status(400).send(e))
}

module.exports = {
	getAllCurrentRole: getAllCurrentRole
}