
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
require("./models/User");
require("./models/Item");
require("./models/Comment");
var Item = mongoose.model("Item");
var Comment = mongoose.model("Comment");
var User = mongoose.model("User");

const insertAll = async () => {
	await User.deleteMany({});
	await Item.deleteMany({});
	await Comment.deleteMany({});
	
	const users = new Array(100).fill(0).map((_, index) => {
		return {username: `user${index}`, email: `user${index}@company.com`};
	});
	const usersRes = await User.insertMany(users);	

	const items = new Array(100).fill(0).map((_, index) => {
		return {title: `title-${index}`, description: `description-${index}`, seller: usersRes[index]._id}
	});
	const itemsRes = await Item.insertMany(items);

	const comments = new Array(100).fill(0).map((_, index) => {
		return {body: `body-${index}`, seller: usersRes[index]._id, item: itemsRes[index]._id}
	});
	await Comment.insertMany(comments);
}

insertAll().then(() => {
	mongoose.connection.close()
});