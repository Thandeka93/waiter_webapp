function waiter(db){
    
    async function waiters(waiterName, dayOfTheWeek){
        try{
            //enter a waiter in the waiter table
            await db.none('INSERT INTO waiters (waiter_name) VALUES ($1)', [waiterName]);
            //get the waiter id
            let waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);
            //update availability for each day and insergth to waiter id and day id into scheduking table
            for(let day of dayOfTheWeek){
                let dayId = await db.oneOrNone('SELECT id FROM day_of_the_week WHERE day = $1', [day]);
                await db.none('INSERT INTO schedule (waiter_id,day_id, available) VALUES ($1,$2, $3)',[waiterId.id, dayId.id, true]);
            }
        }
        catch(error){
            console.error(error.message)
        }
    }

    //get each waiter's  schedule 
    async function getWaiterSchedule(waiterName){
        try{
            //join the three tables to get all inserted values
            let waiterSchedule = await db.many('SELECT waiters.waiter_name, day_of_the_week.day FROM waiters JOIN schedule ON waiters.id = schedule.waiter_id JOIN day_of_the_week ON schedule.day_id = day_of_the_week.id WHERE waiters.waiter_name = $1', [waiterName])
            return waiterSchedule
        }
        catch(error){
            console.error(error.message)
        }
    }
    
    //get all waiters schedule 
    async function getAllSchedules(){
        try{
            let allWaiterSchedules = await db.manyOrNone('');
            return allWaiterSchedules;
        }
        catch(error){
            console.error(error.message)
        }
    }

    //count the number of waiters per day 
    async function countAvailableWaiters(){

    }
    async function cancel(waiterName, day){
        try{
            //get waiter id
            let waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);
           // get day id
            let dayId = await db.oneOrNone('SELECT id FROM day_of_the_week WHERE day = $1', [day]);
            //delete the available day from the schedule table
            await db.none('DELETE FROM schedule WHERE waiter_id = $1 AND day_id = $2', [waiterId.id, dayId.id]);
        }
        catch(error){
            console.error(error.message)
        }
    }
    
    return{
        waiters,
        getAllSchedules,
        getWaiterSchedule,
        countAvailableWaiters,
        cancel
    }
}

export default waiter