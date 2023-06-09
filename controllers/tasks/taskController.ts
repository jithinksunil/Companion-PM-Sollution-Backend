import projectCollection from "../../models/projectSchema"
import siteEngineerCollection from "../../models/siteEngineerSchema"
import taskCollection, { taskDocument } from "../../models/taskShema"
import { reqType, resType } from "../../types/expressTypes"
import { Types } from "mongoose"

const taskController = {

  tasks: async (req: reqType, res: resType) => {
    const projectManagerId = new Types.ObjectId(req.session.projectManager._id)

    projectCollection.aggregate([
      { $match: { "projectManagers.projectManagerId": projectManagerId } },
      {
        $project: {
          name: 1,
          projectManagers: {
            $filter: {
              input: "$projectManagers",
              as: 'pm',
              cond: {
                $and: [
                  { $eq: ["$$pm.projectManagerId", projectManagerId] },
                  { $eq: ["$$pm.status", true] }
                ]
              }
            }
          }
        }
      }, { $match: { "projectManagers.projectManagerId": projectManagerId } },
      {
        $lookup: {
          from: "site_engineer_collections",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$projectId", "$projects.projectId"] }
              }
            }, {
              $project: {
                name: 1,
                currentTaskOrder: 1,
                projects: {
                  $filter: {
                    input: "$projects",
                    as: 'project',
                    cond: {
                      $and: [
                        { $eq: ["$$project.projectId", "$$projectId"] },
                        { $eq: ["$$project.status", true] }
                      ]
                    }
                  }
                }
              }
            }, { $match: { "projects.status": true } }, {
              $lookup: {
                from: "task_collections",
                let: { task: '$currentTaskOrder' },
                pipeline: [{ $match: { $expr: { $in: ['$_id', '$$task'] } } }, { $project: { name: 1 } }],
                as: "taskDetails"
              }
            },
            { $project: { name: 1, taskDetails: 1 } }],
          as: "onDutySiteEngineers"
        }
      }, {
        $lookup: {
          from: "task_collections",
          let: { projectId: '$_id' },
          pipeline: [{ $match: { $expr: { $eq: ["$projectId", "$$projectId"] } } }, {
            $project: {
              name: 1, siteEngineers: {
                $filter:
                {
                  input: "$siteEngineers",
                  as: "siteEngineer",
                  cond: {
                    $eq: ["$$siteEngineer.status", true]
                  }
                }
              }
            }
          }, { $match: { siteEngineers: [] } }],
          as: 'unAssignedTasks'
        }
      },
      { $project: { projectId: "$_id", _id: 0, name: 1, onDutySiteEngineers: 1, unAssignedTasks: 1 } }
    ]).then((projects: any) => {

      const data = [...projects]
      data.forEach((item: any) => {
        const onDutySiteEngineers: any = {}
        onDutySiteEngineers.unAssignedTasks = item.unAssignedTasks
        item.onDutySiteEngineers.forEach((eng: any) => {
          onDutySiteEngineers[eng.name] = eng.taskDetails
        })
        item.onDutySiteEngineers = onDutySiteEngineers
      })
      const message = req.query.message

      res.json({ tokenVerified: true, data, message, status: true })

    }).catch((err) => {
      console.log(err);

      res.json({ message: "data base facing issues to fetch the tasks now" })
    })
  },
  taskAssignment: async (req: reqType, res: resType) => {
    const { startColumn, endColumn, dragEnterIndex, movingItem } = req.body
    const movingItemId = new Types.ObjectId(movingItem._id)
    const startSiteEngineer = await siteEngineerCollection.findOneAndUpdate({ name: startColumn }, { $pull: { currentTaskOrder: movingItemId } }, { returnOriginal: false })
    const endSiteEngineer = await siteEngineerCollection.findOne({ name: endColumn })

    if (startSiteEngineer) {
      await taskCollection.updateOne({ _id: movingItemId, "siteEngineers.siteEngineerId": startSiteEngineer._id }, { $set: { "siteEngineers.$.status": false } })
    }

    if (endSiteEngineer) {
      const currentTaskOrder = endSiteEngineer.toObject().currentTaskOrder
      currentTaskOrder.splice(dragEnterIndex, 0, movingItemId)
      await siteEngineerCollection.updateOne({ name: endColumn }, { currentTaskOrder })

      const matched = await taskCollection.findOne({ _id: movingItemId, "siteEngineers.siteEngineerId": endSiteEngineer._id })
      if (matched) {
        await taskCollection.updateOne({ _id: movingItemId, "siteEngineers.siteEngineerId": endSiteEngineer._id }, { "siteEngineers.$.status": true })

      } else {
        await taskCollection.updateOne({ _id: movingItemId }, { $push: { siteEngineers: { "siteEngineerId": endSiteEngineer._id, "status": true } } })
      }
    }

    if (startColumn == 'unAssigned') {
      await taskCollection.updateOne({ _id: movingItemId }, {})
    }



    res.redirect('/task?message=Successfull updated')

  },
  add: async (req: reqType, res: resType) => {
    try {
      const { siteEngineerName, projectId } = req.query
      const { task } = req.body
      const siteEngineer = await siteEngineerCollection.findOne({ name: siteEngineerName })
      const project = await projectCollection.findOne({ _id: projectId })
      let taskData: taskDocument | null
      let currentTaskOrder: Array<Types.ObjectId>
      if (siteEngineer && project) {
        await taskCollection.insertMany([{ name: task, siteEngineers: [{ siteEngineerId: siteEngineer._id, status: true }], projectId: project._id }])
        taskData = await taskCollection.findOne({ name: task, "siteEngineers.$.siteEngineerId": siteEngineer._id, "siteEngineers.$.status": true })
        currentTaskOrder = siteEngineer.currentTaskOrder
        if (currentTaskOrder) {
          if (taskData)
            currentTaskOrder.splice(0, 0, taskData._id)
        } else {

          currentTaskOrder = [taskData?._id]
        }
        await siteEngineerCollection.updateOne({ name: siteEngineerName }, { currentTaskOrder })
      }
      else if (siteEngineerName == "unAssignedTasks" && project) {
        await taskCollection.insertMany([{ name: task, siteEngineers: [], projectId: project._id }])
      }

      res.redirect('/task?message=Task added')
    }
    catch (err) {
      res.json({ message: "cannot save the task right now" })
    }
  }
}

export default taskController


