'use strict';
const Issue = require('../models/issue.js');

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(async function (req, res) {
      let project = req.params.project;
      let error;
      let result;
      try {
        const _id = req.query._id;
        const issue_title = req.query.issue_title;
        const issue_text = req.query.issue_text;
        const created_by = req.query.created_by;
        const assigned_to = req.query.assigned_to;
        const status_text = req.query.status_text;
        const open = req.query.open;

        let filter = { project: project };
        if (_id) {
          filter['_id'] = _id;
        }
        if (issue_title) {
          filter['issue_title'] = issue_title;
        }
        if (issue_text) {
          filter['issue_text'] = issue_text;
        }
        if (created_by) {
          filter['created_by'] = created_by;
        }
        if (assigned_to) {
          filter['assigned_to'] = assigned_to;
        }
        if (status_text) {
          filter['status_text'] = status_text;
        }
        if (open != undefined) {
          filter['open'] = open;
        }

        console.log(filter);

        result = await Issue.find(filter).select('-project -__v').exec();
      } catch (err) {
        error = err;
      }

      if (error) {
        res.status(200).json(error);
      } else {
        res.status(200).json(result);
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      let error;
      let newIssue;
      try {
        // console.log(req.body);
        const issue_title = req.body.issue_title;
        const issue_text = req.body.issue_text;
        const created_by = req.body.created_by;
        const assigned_to = req.body.assigned_to ?? '';
        const status_text = req.body.status_text ?? '';

        newIssue = new Issue({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
        });
        await newIssue.validate();
        await newIssue.save();
      } catch (err) {
        error = err;
      }

      if (error) {
        res.status(200).json({ error: 'required field(s) missing' });
      } else {
        res.status(200).json({
          _id: newIssue._id,
          issue_title: newIssue.issue_title,
          issue_text: newIssue.issue_text,
          created_on: newIssue.created_on,
          updated_on: newIssue.updated_on,
          created_by: newIssue.created_by,
          assigned_to: newIssue.assigned_to,
          open: newIssue.open,
          status_text: newIssue.status_text,
        });
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      let error;
      let _id = req.body._id;
      if (!_id) {
        res.status(200).json({ error: 'missing _id' });
        return;
      }
      let result;
      try {
        const issue_title = req.body.issue_title;
        const issue_text = req.body.issue_text;
        const created_by = req.body.created_by;
        const assigned_to = req.body.assigned_to;
        const status_text = req.body.status_text;
        const open = req.body.open;
        if (
          !issue_title &&
          !issue_text &&
          !created_by &&
          !assigned_to &&
          !status_text &&
          open == undefined
        ) {
          res.status(200).json({ error: 'no update field(s) sent', _id: _id });
          return;
        }
        let update = { updated_on: new Date() };
        if (issue_title) {
          update['issue_title'] = issue_title;
        }
        if (issue_text) {
          update['issue_text'] = issue_text;
        }
        if (created_by) {
          update['created_by'] = created_by;
        }
        if (assigned_to) {
          update['assigned_to'] = assigned_to;
        }
        if (status_text) {
          update['status_text'] = status_text;
        }
        if (open != undefined) {
          update['open'] = open;
        }
        // console.log(update);

        result = await Issue.findOneAndUpdate({ _id }, update, { new: true });
        // console.log(result);
      } catch (err) {
        error = err;
      }

      if (error || !result) {
        res.status(200).json({ error: 'could not update', _id: _id });
      } else {
        res.status(200).json({ result: 'successfully updated', _id: _id });
      }
    })

    .delete(async function (req, res) {
      //let project = req.params.project;
      let error;
      let _id = req.body._id;
      if (!_id) {
        res.status(200).json({ error: 'missing _id' });
        return;
      }
      let result;
      try {
        result = await Issue.findByIdAndDelete(_id);
        // console.log(result);
      } catch (err) {
        error = err;
      }
      // console.log(error);
      if (error || !result) {
        res.status(200).json({ error: 'could not delete', _id: _id });
      } else {
        res.status(200).json({ result: 'successfully deleted', _id: _id });
      }
    });
};
