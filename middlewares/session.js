var User = require('../models/user')
module.exports = function(req,res,next){
	// console.log(req.session.user_id )
	req.session.user_id='58292f2ebd8c4823d0e19ab3'
	if(!req.session.user_id){
		res.redirect('/')
	}else{
		User.findById(req.session.user_id, function(err,user){
			if(err){
				res.redirect('/')
			}else{
				res.locals = {user: user}
				next();
			}
		})
		
	}
	
}