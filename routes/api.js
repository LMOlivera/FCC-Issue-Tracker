'use strict';

const expect   = require('chai').expect;
const mongoose = require('mongoose');

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

let Project = mongoose.model('Project', projectSchema);


module.exports = function (app) {

  app.route('/api/issues/:project')
    
    //6 - WIP
    .get(function (req, res){
      let project = req.params.project;
      let search = {};
      search.issue_title = req.query.issue_title;
      search.issue_text = req.query.issue_text;
      search.created_by = req.query.created_by;
      search.assigned_to = req.query.assigned_to;
      search.status_text = req.query.status_text;
      search.created_on = req.query.created_on;
      search.updated_on = req.query.updated_on;
      search.open = req.query.open;
      if(project) {
        Project.findOne({project_name: project}, (err, data)=>{
          if(err) {
            res.json({error: "Something happened."});
          }else{
            //Here you have to continue
            let filteredIssues = [];
            data.issues.map((issue)=>{
              let coincidences = 0;
              for(let i = 0; i<issue.length; i++) {
                if(issue[i] == search[issue[i].toString()]){
                  coincidences++;
                }
              }
              if (req.query.length == coincidences) {
                filteredIssues.push(issue);
              }              
            });
            res.json({issues: data.issues});
          }
        });
      }else{
        res.json({error: "No project specified"});
      }
    })
    
    //2 & 3 - POST issues
    .post(function (req, res){
      let projectName = req.params.project;
      let issue = {issue_title: req.body.issue_title,
                   issue_text: req.body.issue_text,
                   created_by: req.body.created_by,
                   assigned_to: req.body.assigned_to,
                   status_text: req.body.status_text,
                   created_on: new Date(),
                   updated_on: new Date(),
                   open: true};
      let p = new Project({project_name: projectName, issues: [issue]});
      if(projectName && req.body.issue_title && req.body.issue_text && req.body.created_by)  {
        Project.findOne({project_name: projectName},(err, data)=>{
          if(err){
            
          }else{
            if(data==undefined) {
              // Create project and add issue
              p.save((err, data)=>{});
            }else{
              // Add Issue to project
              data.issues.push(issue);
              Project.findOneAndUpdate({project_name: projectName},
                                       {issues: data.issues},
                                       (err, data)=>{
                return data;                
              });
            }
          }
        });
      }else{
        res.json({error: "Required data no specified"});
      }      
    })
    
    //4 - Update (PUT) issue
    .put(function (req, res){
      let project = req.params.project;
      let id = req.body._id;
      if(project) {
        if (req.body.issue_title == undefined && req.body.issue_text == undefined && req.body.created_by == undefined && req.body.assigned_to == undefined && req.body.status_text == undefined) {
          return "No update field sent";
        }else{
          Project.findOne({project_name: project},(err, data)=>{
            if (err) {
              console.log(err);
              return "Could not update " + id;
            }else{
              //Look for issue by its _id to populate fields
              const position = data.issues.findIndex((iss)=>{return iss._id==id});
              let newIssues = [...data.issues];
              newIssues[position].issue_title = req.body.issue_title;
              newIssues[position].issue_text = req.body.issue_text;
              newIssues[position].created_by = req.body.created_by;
              newIssues[position].assigned_to = req.body.assigned_to;
              newIssues[position].status_text = req.body.status_text;
              newIssues[position].updated_on = new Date();
              newIssues[position].open = (req.body.open=="on" ? false : true );
              Project.findOneAndUpdate({project_name: project},
                                       {issues: newIssues},
                                       (err, doc)=>{
                return "Successfully updated";
              });
            }
          });
        }
      }else{
        res.json({error: "No project specified"});
      }
    })
    
    //5 - DELETE issue
    .delete(function (req, res){
      let project = req.params.project;
      if(project) {
        if(req.body._id == undefined) {
          return "_id error";
        }else{
          Project.findOne({project_name: project},(err, data)=>{
            if(err) {
              return "Could not delete " + req.body._id;
            }else{
              let newIssues = [];
              data.issues.map((issue)=>{
                if (issue._id != req.body._id) {
                  newIssues.push(issue);
                }
              });
              Project.findOneAndUpdate({project_name: project},
                                       {issues: newIssues},
                                       (err, data)=>{
                if (err) {
                  return "Could not delete " + req.body._id;
                }else{
                  return "Deleted " + req.body._id;
                }
              });
            }
          });
        }
      }else{
        res.json({error: "No project specified"});
      }      
    });    
};
