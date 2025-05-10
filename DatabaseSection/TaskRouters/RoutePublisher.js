import express from 'express'
import { CreateTask, GetAllTasks, GetTaskById, UpdateTaskById, DeleteTaskById, ChangeStatusById, GetAssignTaskData, GetCurrentTaskData, sendMail, TaskCompleted } from './Publisher.js'
import { VerifyAdminOrUser } from '../Middlewares/VerifyAdmin.js'
const TaskRoute = express.Router()

TaskRoute.post('/CreateTask', VerifyAdminOrUser, CreateTask)
TaskRoute.get('/getAllTasks', VerifyAdminOrUser, GetAllTasks)
TaskRoute.get('/getTaskById/:id', GetTaskById)
TaskRoute.put('/UpdateTaskById/:id', VerifyAdminOrUser, UpdateTaskById)
TaskRoute.delete('/DeleteTaskById/:id', VerifyAdminOrUser, DeleteTaskById)
TaskRoute.put('/ChangeStatusById/:id', VerifyAdminOrUser, ChangeStatusById)
TaskRoute.post('/GetAssignTaskData', VerifyAdminOrUser, GetAssignTaskData)
TaskRoute.post('/GetCurrentTaskData', VerifyAdminOrUser, GetCurrentTaskData)
TaskRoute.put('/TaskCompleted/:id', VerifyAdminOrUser, TaskCompleted)
TaskRoute.post('/sendMail', sendMail)


export { TaskRoute }