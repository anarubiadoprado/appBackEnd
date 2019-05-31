const testdb = require('../data/registration');


exports.getAll = () => {
 return testdb.find({}, (err, result) => {
  if (err){
    return err;
  } 
  return result
  });
};


exports.add = () => {
var newRegistration = {'fistname':'', 'lastname':'', 'email': '', 'password': '' }
testdb.update({'fistname':''}, newRegistration, {upsert:true}, (err, result) => {
  if (err) {
  	return err;
  	}
  		return result
  	
  console.log(result);
  // other code here
	}); 
}; 