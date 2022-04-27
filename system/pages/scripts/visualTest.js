

// call function to start test, 3 second ready countdown, 
// two timers one with time when video plays and one that counts up, if old time < new time then fail else 
// take old time from new time and output alert for reaction time
//
//



function videoTest(params) 
{
    // have a 3 appear
    delay(4000).then(() => document.getElementById('countdown').innerHTML = "3");
    //have a 2 appear
    delay(4000).then(() => document.getElementById('countdown').innerHTML = "2");
    // have a 1 appear
    delay(4000).then(() => document.getElementById('countdown').innerHTML = "1");
    
    //  have a click thing appear
    delay(4000).then(() => document.getElementById('countdown').innerHTML = '<img src="eye.jpg"/>');; // change image to something to click

    // random number between 5000 and 15000
    var timeDelay = Math.floor(Math.random() * 10000) + 5000;

    // bring up image to click
    var start = new Date(); 
    delay(timeDelay).then(() => videotestPlay(start, timeDelay));



    
}


function videotestPlay(startTime, timeDelay) 
{
    // play audio file
    document.getElementById('Approach').style.display = "block"; //filepath
    var reactionTime;

    

    const div = document.getElementById('countdown'); 

    div.onclick = () => 
    {
        var elapsed = new Date() - startTime; // subtract from overall time happened
        //

        if (elapsed < timeDelay) 
        {
            alert("you clicked the eye too early")
        } 
        else 
        {
            reactionTime = elapsed - timeDelay; //subtract by video playtime to when the car appears
            alert("your reaction time is " + reactionTime + "ms");
        }

    }

    


}


function delay(time) // delays line of code playing by given second
{
  return new Promise(resolve => setTimeout(resolve, time));
}



























