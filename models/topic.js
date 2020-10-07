const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    topic: {
        type: String,
        required: true
    }
})

const Topic = mongoose.model('topic', topicSchema);
module.exports = Topic;