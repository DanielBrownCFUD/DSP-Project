function displayParameters(numberofPeople) 
{
    var length = parseInt(numberofPeople) + 1;

    for (let index = 2; index < 11; index++) 
    {
        var fieldsetIndex = "fieldset" + index.toString();
        document.getElementById(fieldsetIndex).style.display = "none";
    }


    for (let index = 2; index < length; index++) 
    {
        var fieldsetIndex = "fieldset" + index.toString();
        document.getElementById(fieldsetIndex).style.display = "block";
    }
}



function saveParameters(numberofPeople) 
{
    alert("lmao");
    var peopleToFile = [];
    var isDrunk = document.querySelector('input[name="drunk_parameter"]:checked').value;

    var typePerson = document.querySelector('input[name="young_parameter"]:checked').value;
    var isOld = document.querySelector('input[name="old_parameter"]:checked').value;

    var isTired = document.querySelector('input[name="tired_parameter"]:checked').value;
    var isDistraced = document.querySelector('input[name="distract_parameter"]:checked').value;
    var isHealthy = document.querySelector('input[name="health_parameter"]:checked').value;



    for (let index = 2; index < numberofPeople; index++) 
    {

        var drunkRadioButton = "drunk_parameter" + index.toString();
        var youngRadioButton = "young_parameter" + index.toString();
        var oldRadioButton = "old_parameter" + index.toString();
        var tiredRadioButton = "tired_parameter" + index.toString();
        var distractRadioButton = "distract_parameter" + index.toString();
        var healthRadioButton = "health_parameter" + index.toString();

        isDrunk = document.querySelector('input[name=drunkRadioButton]:checked').value;
        typePerson = document.querySelector('input[name=youngRadioButton]:checked').value;
        isOld = document.querySelector('input[name=oldRadioButton]:checked').value;
        isTired = document.querySelector('input[name=tiredRadioButton]:checked').value;
        isDistraced = document.querySelector('input[name=distractRadioButton]:checked').value;
        isHealthy = document.querySelector('input[name=healthRadioButton]:checked').value;

        var pedestrian = new Pedestrian(speed, reactionTime, isDrunk, isHealthy, isRunning, isTired, isunalert, isWalking, typePerson)
        peopleToFile.push(pedestrian);

    }
    // save to file
    const fs = require('fs');

    peopleToFile.forEach(element => 
    {
        const data = JSON.stringify(element);

        fs.writeFile('personData.json', data, (err) => {
            if (err)
            {
                throw err;
            }
        })
        alert("File Created");
    }
    );
}