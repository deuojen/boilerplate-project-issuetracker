const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  // #1
  test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Create an issue with every field',
        issue_text: 'desc',
        created_by: 'chai',
        assigned_to: 'chai',
        status_text: 'inprogress',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.include(
          res.text,
          '"issue_title":"Create an issue with every field"'
        );
        assert.include(res.text, '"issue_text":"desc"');
        assert.include(res.text, '"created_by":"chai"');
        assert.include(res.text, '"assigned_to":"chai"');
        assert.include(res.text, '"open":true');
        assert.include(res.text, '"status_text":"inprogress"');
        done();
      });
  });
  // #2
  test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Create an issue with only required fields',
        issue_text: 'desc',
        created_by: 'chai',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.include(
          res.text,
          '"issue_title":"Create an issue with only required fields"'
        );
        assert.include(res.text, '"issue_text":"desc"');
        assert.include(res.text, '"created_by":"chai"');
        assert.include(res.text, '"assigned_to":""');
        assert.include(res.text, '"open":true');
        assert.include(res.text, '"status_text":""');
        done();
      });
  });
  // #3
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"error":"required field(s) missing"}');
        done();
      });
  });
  // #4
  test('View issues on a project: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.include(
          res.text,
          '"issue_title":"Create an issue with only required fields"'
        );
        assert.include(res.text, '"issue_text":"desc"');
        assert.include(res.text, '"created_by":"chai"');
        assert.include(res.text, '"assigned_to":""');
        assert.include(res.text, '"open":true');
        assert.include(res.text, '"status_text":""');
        assert.include(
          res.text,
          '"issue_title":"Create an issue with every field"'
        );
        assert.include(res.text, '"issue_text":"desc"');
        assert.include(res.text, '"created_by":"chai"');
        assert.include(res.text, '"assigned_to":"chai"');
        assert.include(res.text, '"open":true');
        assert.include(res.text, '"status_text":"inprogress"');
        done();
      });
  });
  // #5
  test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest?status_text=inprogress')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.include(
          res.text,
          '"issue_title":"Create an issue with every field"'
        );
        assert.include(res.text, '"issue_text":"desc"');
        assert.include(res.text, '"created_by":"chai"');
        assert.include(res.text, '"assigned_to":"chai"');
        assert.include(res.text, '"open":true');
        assert.include(res.text, '"status_text":"inprogress"');
        done();
      });
  });
  // #6
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get(
        '/api/issues/apitest?status_text=inprogress&created_by=chai&assigned_to=chai'
      )
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.include(res.text, '"issue_text":"desc"');
        assert.include(res.text, '"created_by":"chai"');
        assert.include(res.text, '"assigned_to":"chai"');
        assert.include(res.text, '"open":true');
        assert.include(res.text, '"status_text":"inprogress"');
        done();
      });
  });
  // #7
  test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: '671bba0e2346d1ccb2267916',
        assigned_to: 'chai',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.text,
          '{"result":"successfully updated","_id":"671bba0e2346d1ccb2267916"}'
        );
        done();
      });
  });
  // #8
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: '671bba0e2346d1ccb2267916',
        assigned_to: 'chai',
        open: false,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.text,
          '{"result":"successfully updated","_id":"671bba0e2346d1ccb2267916"}'
        );
        done();
      });
  });
  // #9
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"error":"missing _id"}');
        done();
      });
  });
  // #10
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: '671bba0e2346d1ccb2267916',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.text,
          '{"error":"no update field(s) sent","_id":"671bba0e2346d1ccb2267916"}'
        );
        done();
      });
  });
  // #11
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: 'none',
        open: false,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"error":"could not update","_id":"none"}');
        done();
      });
  });
  // #12
  test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .send({
        _id: 'none',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        // need to keep _ids
        done();
      });
  });
  // #13
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .send({
        _id: 'none',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"error":"could not delete","_id":"none"}');
        done();
      });
  });
  // #14
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"error":"missing _id"}');
        done();
      });
  });
});
