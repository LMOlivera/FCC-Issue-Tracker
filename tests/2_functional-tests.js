/*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
chai.use(chaiHttp);



suite('Functional Tests', function() {
    //OK
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
           let response = res.body[0];
           assert.equal(res.status, 200);
           assert.equal(response.issue_title, 'Title');
           assert.equal(response.issue_text, 'text');
           assert.equal(response.created_by, 'Functional Test - Every field filled in');
           assert.equal(response.assigned_to, 'Chai and Mocha');
           assert.equal(response.status_text, 'In QA');
           assert.equal(response.open, true);
           done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title2',
          issue_text: 'text2',
          created_by: 'Functional Test - Required field filled in'
        })
        .end(function(err, res){
           assert.equal(res.status, 200);
           let response = res.body[1];
           assert.equal(response.issue_title, 'Title2');
           assert.equal(response.issue_text, 'text2');
           assert.equal(response.created_by, 'Functional Test - Required field filled in');
           assert.equal(response.assigned_to, '');
           assert.equal(response.status_text, '');
           assert.equal(response.open, true);
           done();
        });       
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({})
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.body.error, "Required data no specified");
           done();
        });  
      });      
    });
    //OK, DONT DELETE "SPECIFIC" ON DATABASE
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/impossibleToGuESssNeim')
        .send({})
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.body.error, "No update field sent");
           done();
        }); 
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/SPECIFIC')
        .send({
          _id: "5cfab1ee21ab65256e502570",
          issue_title: "TestBro"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "TestBro");
          done();
        }); 
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/SPECIFIC')
        .send({
          _id: "5cfab1ee21ab65256e502570",
          issue_title: "MultiField",
          issue_text: "MultiField",
          created_by: "TESTER",
          assigned_to: "MultiField",
          status_text: "MultiField",
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "MultiField");
          assert.equal(res.body.issue_text, 'MultiField');
          assert.equal(res.body.created_by, 'TESTER');
          assert.equal(res.body.assigned_to, 'MultiField');
          assert.equal(res.body.status_text, 'MultiField');
          done();
        }); 
      });
      
    });
    //OK
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({open: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          for(let i = 0; i<res.body.length; i++) {
            assert.equal(res.body[i].open, true);
          }
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({open: true, issue_title: "title2"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          for(let i = 0; i<res.body.length; i++) {
            assert.equal(res.body[i].issue_title, "title2");
            assert.equal(res.body[i].open, true);
          }
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "_id error");
          done();
        });
      });
      //This test is for a future refactor
      /*test('Valid _id', function(done) {
        
      });*/
      
    });

});
