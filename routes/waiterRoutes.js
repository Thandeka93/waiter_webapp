// Import necessary modules and services
import express from 'express';
import db from '../db.js';
import waiter from '../services/query.js';

const router = express.Router();
const waiterRoute = waiter(db);

router.get('/',  (req,res)=>{
    res.render('index')
})

router.get('/days', async(req,res)=>{
    try{
        //list all the schedules for the week to see available waiters
        const allSchedules = await waiterRoute.getAllSchedules()
//list days and the number of avalable waiters 

        res.render('manager',{
            allSchedules
        })
    }
    catch(error){
        console.error('Failure to get schedules')
    }

})

router.post('/waiters', async (req,res)=>{
    try{
        const waiterName = req.body.username;
        const dayOfTheWeek = req.body.days;

        //get the waiter name, and days and insert to the tables
        await waiterRoute.waiters(waiterName, dayOfTheWeek) //call the function for updating the name and days
        console.log(waiterName, dayOfTheWeek)

        res.redirect(`/waiters/${waiterName}`);
    }
    catch(error){
        console.error('Failure to post schedules')
    }
})


router.get('/waiters/:username', async (req,res)=>{
    try{
        const name = req.params.username;
        //get each waiter schedule 
        const waiterSchedule = await waiterRoute.getWaiterSchedule(name)
        res.render('waiters', {
            waiterSchedule,
            username: name
        })
    }catch(error){
        console.error('Failure to get schedules')
    }
})
router.post('/waiters/:username/cancel', async (req,res)=>{
    try{
        const waiterName = req.params.username;
        const day = req.body.day;
        //remove the available name
        await waiterRoute.cancel(waiterName, day);
        res.redirect(`/waiters/${waiterName}`);
    }
    catch(error){
        console.error('Failure to cancel schedule')
    }
})

export default router