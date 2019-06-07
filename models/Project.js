const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB, {useNewUrlParser: true, useFindAndModify: false});

let projectSchema = new mongoose.Schema({
  project_name: {type: String, required: true},
  issues: [{
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    assigned_to: String,
    status_text: String,
    created_on: Date,
    updated_on: Date,
    open: Boolean
  }]
});

//Glitch is giving errors in the next line but is working as it should!
module.exports = Project = mongoose.model('Project', projectSchema);