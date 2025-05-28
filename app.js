import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import tasks from "./models/tasks.js";
const app = express();

app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

// to POST data
app.post('/api/addtask', (req, res, next)=>{
    console.log(req.body)
 const {task,status,deadline} = req.body;
 
 const tas = new tasks({
    task,
    status,
    deadline
 })

 tas.save()
 return res.status(200).json({message: "success"})
})




// GET data API
// app.get('/api/getTask',async (req, res, next)=>{
//     let tas;
    
//         tas = await tasks.find();
    
//     if(!tas){
//         return res.status(404).json({message: "No task Found."})
//     }
//     return res.status(200).json({tas})
// })
app.get('/api/getTask', async (req, res, next) => {
    let tas;
    try {
        tas = await tasks.find();
    } catch (err) {
        return res.status(500).json({ message: "Error fetching tasks." });
    }

    if (!tas || tas.length === 0) {
        return res.status(404).json({ message: "No task Found." });
    }
    return res.status(200).json({ tas });
});


// delete student
app.delete('/api/deletetask/:_id',async (req, res, next)=>{

    const id=req.params._id

console.log

    let task_delete;
    try{
        task_delete= await tasks.findByIdAndDelete({_id:id})
    }
    catch(err)
    {
        return console.log(err)
    }
    
    if(!task_delete){
        return res.status(400).json({message: "unable to delete."})
    }

    return res.status(200).json({message: "deleted."})

})

//edit task data
app.get('/api/get_task_data/:id', async (req, res, next)=>{
    const _id = req.params.id
    let task_data;
    try{
        task_data = await tasks.findById({_id});
    }catch(err){
        return console.log(err)
    }
    if(!task_data){
        return res.status(400).json({message:"No task Found."})
    }
    return res.status(201).json({task_data})
})



// update form by id
app.put('/api/edit_task/:id', async (req, res, next)=>{
    const taskid = req.params.id
    const {task, status, deadline} = req.body;
    let tsk;
    try{
        tsk = await student.findByIdAndUpdate(taskid,{
            task,
            status,
            deadline
        });
    }catch(err){
        return console.log(err)
    }
    if(!tsk){
        return res.status(400).json({message:"Unable to update the task."})
    }
    return res.status(200).json({tsk})
})
// end edit user

//database connection



mongoose.connect('mongodb+srv://ratnabhupathitanala:Aditya123@cluster0.eahgacc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => app.listen(4000))
.then(() =>
console.log("Connected to Database & Listining to localhost 4000")
)
.catch((err) => console.log(err));






