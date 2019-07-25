const getAllCurrentRole = (pool) => (req, res, next) => {
	pool
  	.connect()
  	.then(client => {
    	return client.query('SELECT * FROM CurrentRole')
      	.then(res => {
			client.release()
			return res.json()
      	})
      	.catch(e => {
			client.release()
    	    console.log(err.stack)
			return res.status(400).send(err);
      	})
	})
}

module.exports = {
	getAllCurrentRole: getAllCurrentRole
}