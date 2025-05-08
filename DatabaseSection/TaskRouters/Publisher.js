import { AuthModel } from "../DatabaseSchema/AuthSchema.js";
import { NotificationModel } from "../DatabaseSchema/NotificationSchema.js";
import { TaskModel } from "../DatabaseSchema/TaskSchema.js";
import { sendEmail, sendUserRequest } from "./MailConfigure.js";

const CreateTask = async (req, res) => {
    const { username } = req.user;

    try {
        const { title, description, status, priority, dueDate, assignedTo } = req.body;

        if (!title.trim() || !description.trim() || !status.trim() || !priority.trim() || !dueDate.trim()) {
            return res.status(400).json({
                message: 'Title, Description, Status, Priority, DueDate are required.',
                success: false
            });
        }

        const isTitle = await TaskModel.findOne({ title });
        if (isTitle) {
            return res.status(409).json({
                message: 'Title already exists. Please choose a different one.',
                success: false
            });
        }

        const creator = await AuthModel.findOne({ username });
        if (!creator) {
            return res.status(404).json({ message: 'Creator not found', success: false });
        }

        const assigner = await AuthModel.findOne({ username: assignedTo });
        if (!assigner) {
            return res.status(404).json({ message: 'Assigned user not found', success: false });
        }

        const createTask = await TaskModel.create({
            title,
            description,
            priority: priority || 'Medium',
            status: status || 'Pending',
            dueDate,
            createdBy: creator._id,
            assignedTo: assigner._id,
        });

        if (assignedTo && !creator._id.equals(assigner._id)) {
            try {
                const sendMail = await sendEmail(
                    assigner.email,
                    `New Task Assigned: ${title}`,
                    `You have been assigned a new task by ${creator.username}.`,
                    `<h1>New Task Assigned</h1>
                     <p>Assigned by: ${creator.username}</p>
                     <p><strong>Task:</strong> ${title}</p>
                     <p><strong>Due:</strong> ${dueDate}</p>
                     <p><strong>Priority:</strong> ${priority}</p>
                     <p><strong>Description:</strong> ${description}</p>
                     <a href="${process.env.FRONTEND_URL}/tasks/${createTask._id}">View Task</a>`
                );
                console.log('sendMail', sendMail)
            } catch (err) {
                return res.status(500).json({
                    message: 'Failed to send task assignment email.',
                    success: false
                });
            }
        }

        const Notification = await NotificationModel.create({
            sender: creator._id,
            recipient: assigner._id,
            message: description,
            task: createTask._id,
        });

        if (!Notification) {
            return res.status(500).json({
                message: 'Failed to save notification.',
                success: false
            });
        }

        return res.status(201).json({
            task: createTask,
            notification: Notification,
            message: `Task created and assigned to ${assigner.username}`,
            success: true
        });

    } catch (error) {
        console.error("CreateTask error:", error);
        return res.status(500).json({
            message: 'Internal server error!',
            error: error.message,
            success: false
        });
    }
};

const GetAllTasks = async (req, res) => {
    const role = req.user.role
    try {

        if (role !== 'admin' && role !== 'user') {
            return res.status(403).json({
                message: 'Not authorized, Only user and admin can access the data.'
            })
        }
        const users = await TaskModel.find({})
        return res.status(200).json({
            message: 'Successfully fetched the data.',
            data: users,
            success: true
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error!',
            error: error,
            success: false
        })
    }
}

const GetTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(404).json({
                message: 'Id is required.',
                success: false
            })
        }
        // If user is existed or not.
        // const User = await AuthModel.findOne()
        const userId = await TaskModel.findById({ id })
        if (!userId) {
            return res.status(404).json({
                message: 'Id is not available, try different.',
                success: false
            })
        }
        return res.status(200).json({
            message: 'Successfully fetched the data.',
            data: userId,
            success: true
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error!',
            error: error,
            success: false
        })
    }
}

const GetAssignTaskData = async (req, res) => {
    const { username } = req.body;

    try {
        if (!username) {
            return res.status(400).json({
                message: 'Username is required.',
                success: false
            });
        }

        const user = await AuthModel.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: 'Username is not valid!',
                success: false
            });
        }

        const id = user._id;

        const taskData = await TaskModel.find({ assignedTo: id });

        if (!taskData || taskData.length === 0) {
            return res.status(404).json({
                message: 'No tasks found.',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Successfully fetched the data.',
            data: taskData,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error!',
            error,
            success: false
        });
    }
};

const GetCurrentTaskData = async (req, res) => {
    const { username } = req.body;

    try {
        if (!username) {
            return res.status(400).json({
                message: 'Username is required.',
                success: false
            });
        }

        const user = await AuthModel.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: 'Username is not valid!',
                success: false
            });
        }

        const id = user._id;

        const taskData = await TaskModel.find({ createdBy: id });

        if (!taskData || taskData.length === 0) {
            return res.status(404).json({
                message: 'No tasks found.',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Successfully fetched the data.',
            data: taskData,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error!',
            error,
            success: false
        });
    }
};



const UpdateTaskById = async (req, res) => {
    const updateData = req.body;
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(404).json({
                message: 'Id is required.',
                success: false
            })
        }
        const data = await TaskModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!data) {
            return res.status(404).json({
                message: 'Data is not fetched, Try again later.',
                success: false
            })
        }

        return res.status(200).json({
            data: data,
            message: 'Successfully data is fetched.',
            success: true
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error!',
            error: error,
            success: false
        })
    }
}

const DeleteTaskById = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        if (!id) {
            return res.status(404).json({
                message: 'Id is required.',
                success: false
            })
        }
        const userId = await TaskModel.findByIdAndDelete(id)
        if (!userId) {
            return res.status(404).json({
                message: 'Id is not available, try different.',
                success: false
            })
        }
        return res.status(200).json({
            message: 'Successfully deleted the data.',
            data: userId,
            success: true
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error!',
            error: error,
            success: false
        })
    }
}


const ChangeStatusById = (req, res) => {
    try {

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error!',
            error: error,
            success: false
        })
    }
}

const sendMail = async (req, res) => {
    const { email } = req.body;
    const mail = 'charipallithirumalesh@gmail.com'
    console.log(email)
    try {
        if (!email) {
            return res.status(403).json({
                message: "Message is required.",
                success: 'false'
            })
        }
        const sendMail = await sendUserRequest(
            mail,
            `The User send you a message.`,
            '<h1>Make Response from Task Manager</h1>',
            email
        );
        console.log('sendMail', sendMail)
        return res.status(200).json({
            data: sendMail,
            message: 'Message is successfully send.',
            success: true
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: err,
            message: 'Failed to send message.',
            success: false
        });
    }

}


export { CreateTask, GetAllTasks, GetTaskById, UpdateTaskById, DeleteTaskById, ChangeStatusById, GetAssignTaskData, GetCurrentTaskData, sendMail }