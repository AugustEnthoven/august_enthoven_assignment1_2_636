const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Task = require('../models/Task');
const { updateTask,getTasks,addTask,deleteTask } = require('../controllers/taskController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('addTask Function Test', () => {

    it('should add a new item to cart successfully', async () => {
        // Mock request data
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: { name: "New item", price: "10", url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.zVXFDksXtdGlk6unArbHXwHaD4%3Fpid%3DApi&f=1&ipt=c03a6b184a637788eafd5cf351770ddc580891c71b6d535f48dbef2a3e375075&ipo=images" }
        };
        // Mock task that would be created
        const createdTask = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

        // Stub Task.create to return the createdTask
        const createStub = sinon.stub(Task, 'create').resolves(createdTask);

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await addTask(req, res);

        // Assertions
        expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(createdTask)).to.be.true;

        // Restore stubbed methods
        createStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub Task.create to throw an error
        const createStub = sinon.stub(Task, 'create').throws(new Error('DB Error'));

        // Mock request data
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: { name: "New item", price: 10, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.zVXFDksXtdGlk6unArbHXwHaD4%3Fpid%3DApi&f=1&ipt=c03a6b184a637788eafd5cf351770ddc580891c71b6d535f48dbef2a3e375075&ipo=images" }
        };

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await addTask(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods
        createStub.restore();
    });

});


describe('Update Function Test', () => {

    it('should update task successfully', async () => {
        // Mock task data
        const taskId = new mongoose.Types.ObjectId();
        const existingTask = {
            _id: taskId,
            name: "Old item",
            price: 10,
            deadline: new Date(),
            url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fencyclopedia.pub%2Fmedia%2Fcommon%2F202402%2Fmceclip0-65d7edb98a154.jpg&f=1&nofb=1&ipt=647716ae87ec716e55a40565001e9436578f748d89022e4d661f0c0204c5b119",
            save: sinon.stub().resolvesThis(), // Mock save method
        };
        // Stub Task.findById to return mock task
        const findByIdStub = sinon.stub(Task, 'findById').resolves(existingTask);

        // Mock request & response
        const req = {
            params: { id: taskId },
            body: { name: "New Item" }
        };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await updateTask(req, res);

        // Assertions
        expect(existingTask.name).to.equal("New Item");
        expect(res.status.called).to.be.false; // No error status should be set
        expect(res.json.calledOnce).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });



    it('should return 404 if item is not found', async () => {
        const findByIdStub = sinon.stub(Task, 'findById').resolves(null);

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateTask(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;

        findByIdStub.restore();
    });

    it('should return 500 on error', async () => {
        const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateTask(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.called).to.be.true;

        findByIdStub.restore();
    });



});



describe('GetTask Function Test', () => {

    it('should return items for the given user', async () => {
        // Mock user ID
        const userId = new mongoose.Types.ObjectId();

        // Mock task data
        const tasks = [
            { _id: new mongoose.Types.ObjectId(), title: "Task 1", userId },
            { _id: new mongoose.Types.ObjectId(), title: "Task 2", userId }
        ];

        // Stub Task.find to return mock tasks
        const findStub = sinon.stub(Task, 'find').resolves(tasks);

        // Mock request & response
        const req = { user: { id: userId } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await getTasks(req, res);

        // Assertions
        expect(findStub.calledOnceWith({ userId })).to.be.true;
        expect(res.json.calledWith(tasks)).to.be.true;
        expect(res.status.called).to.be.false; // No error status should be set

        // Restore stubbed methods
        findStub.restore();
    });

    it('should return 500 on error', async () => {
        // Stub Task.find to throw an error
        const findStub = sinon.stub(Task, 'find').throws(new Error('DB Error'));

        // Mock request & response
        const req = { user: { id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await getTasks(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods
        findStub.restore();
    });

});



describe('DeleteTask Function Test', () => {

    it('should delete a task successfully', async () => {
        // Mock request data
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        // Mock task found in the database
        const task = { remove: sinon.stub().resolves() };

        // Stub Task.findById to return the mock task
        const findByIdStub = sinon.stub(Task, 'findById').resolves(task);

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await deleteTask(req, res);

        // Assertions
        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(task.remove.calledOnce).to.be.true;
        expect(res.json.calledWith({ message: 'Task deleted' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

    it('should return 404 if task is not found', async () => {
        // Stub Task.findById to return null
        const findByIdStub = sinon.stub(Task, 'findById').resolves(null);

        // Mock request data
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await deleteTask(req, res);

        // Assertions
        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub Task.findById to throw an error
        const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

        // Mock request data
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await deleteTask(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

});