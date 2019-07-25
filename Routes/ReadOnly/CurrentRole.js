const getAllCurrentRole = (pool) => (req, res, next) => {
	pool.connect()
  	.then(client => {
    	return client.query('SELECT * FROM CurrentRole')
      	.then(data => {
			client.release()
			return res.status(200).send(data.rows)
      	})
      	.catch(e => {
			client.release()
    	    console.log(e.stack)
			return res.status(400).send(e);
      	})
	})
	.catch(e => {
		console.log(e.stack)
		res.status(400).send(e);
	})
}

module.exports = {
	getAllCurrentRole: getAllCurrentRole
}