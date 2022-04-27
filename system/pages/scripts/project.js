// Project plan 
/*
to do list:

generate reaction data
: average reaction times 
create reaction data ai algorithm -- linear regression
implement parameters
create stimuli (outside noise and car noise)
base run/walk speed with 10% buffer for variability



audio vs visual reaction time weight



*/





// ------ Project Start ---------



// Main Body
function generateModel()
{
    var TestData = [];
    var reactionWeights = new ParameterWeights();
    //set parameter weights
    reactionWeights.setWeightDrunk(CallWeights(0));
    reactionWeights.setWeightTired(CallWeights(1));
    reactionWeights.setWeightRunning(CallWeights(2));
    reactionWeights.setWeightWalking(CallWeights(3));
    reactionWeights.setWeightUnalert(CallWeights(4));
    reactionWeights.setWeightHealthy(CallWeights(5));



    for (let index = 0; index < 400; index++) // builds reaction test data for pedestrians
    {
        var reactionTime = Math.floor(Math.random()*150) + 150; // generated reaction time
        var typePerson = createPerson(0);
        var isDrunk = createPerson(1);
        var isTired = createPerson(2);
        var isunalert = createPerson(3);
        var isHealthy = createPerson(4);
        var isWalking = createPerson(5);
        var isRunning = false;
        // calculates speed, find speed value and base it on person type
        var speed = calculateSpeed(typePerson, isWalking);

        if (isWalking == "walk") 
        {
            isRunning = "walk";
        }
        else
        {
            isRunning = "run";
        }
  

        


        // compiles the info into an object and adds it to a list
        var pedestrian = new Pedestrian(speed, reactionTime, isDrunk, isHealthy, isRunning, isTired, isunalert, isWalking, typePerson);



        TestData.push(pedestrian);


    
    }

    // calculates true reaction time, apply parameters to reaction time
    for (let index = 0; index < TestData.length; index++)
    {
        var newReactionTime = calculateReactionTime(TestData[index], reactionWeights);
        TestData[index].setReactionTime(newReactionTime);
    }

    // update parameter weights, perceptron?





    // list of all data sorted by person type
    var oldPeople = [];
    var youngPeople = [];
    var otherPeople = [];


    //sort each old, young and other person into the arrays, 
    for (let index = 0; index < TestData.length; index++)
    {

        var testPedestrian = TestData[index];

        if (testPedestrian.getPersonType() == "Old") 
        {
            oldPeople.push(testPedestrian);
        } 
        else if (testPedestrian.getPersonType() == "Young") 
        {
            youngPeople.push(testPedestrian);
        }
        else
        {
            otherPeople.push(testPedestrian);
        }




    }


    // regressions, holds list of intercept and slope
    var oldPeopleRegression = CalcSums(oldPeople);
    var youngPeopleRegression = CalcSums(youngPeople);
    var otherPeopleRegression = CalcSums(otherPeople);


    var listofPeople = []; // intake data from file
    
    

    // do read file stuff here

    let file = document.querySelector("#file-input").files[0];

    if (document.querySelector("#file-input").files.length == 0) 
    {
		alert('Error : No file selected');
    }
    else
    {

        let reader = new FileReader();
        let readCharacter = "";
        let readString = "";
        reader.readAsText(file);

        reader.addEventListener('load', function(e) {
            // contents of the file
            let text = e.target.result;


            //read file line by line 
            let numberofCommas = 0;

            var reactionTime = Math.floor(Math.random()*150) + 150; // generated reaction time
            var typePerson = "";
            var isDrunk = "";
            var isOld = "";
            var isTired = "";
            var isunalert = "";
            var isHealthy = "";
            var isWalking = "";
            var isRunning = false;
            var speed = 0;
            var numberofPedestrians = 0;



            for (let index = 0; index < text.length; index++) 
            {
                if (text.substring(index, index + 1) == ",") 
                {
                    numberofCommas++;

                    if (numberofCommas == 1) 
                    {
                        isDrunk = readString;

                        readCharacter = "";
                        readString = "";
                    } 
                    else if (numberofCommas == 2) 
                    {
                        typePerson = readString; 
                        readCharacter = "";
                        readString = "";
                    }
                    else if (numberofCommas == 3) 
                    {
                        isTired = readString;
                        readCharacter = "";
                        readString = "";
                    }
                    else if (numberofCommas == 4) 
                    {
                        isunalert = readString;
                        readCharacter = "";
                        readString = "";
                    }
                    else if (numberofCommas == 5) 
                    {
                        isHealthy = readString;
                        readCharacter = "";
                        readString = "";
                    }
                    else if (numberofCommas == 6) 
                    {
                        isRunning = readString;
                        readCharacter = "";
                        readString = "";
                    }


                } 
                else if (text.substring(index, index + 1) == " ") 
                {
                    
                    // add to list/variable/whatever, empty read strings
                    speed = calculateSpeed(typePerson, isRunning);

                    var pedestrian = new Pedestrian(speed, reactionTime, isDrunk, isHealthy, isRunning, isTired, isunalert, isWalking, typePerson);
                    listofPeople.push(pedestrian);

                    var newReactionTime = calculateReactionTime(listofPeople[numberofPedestrians], reactionWeights);
                    listofPeople[numberofPedestrians].setReactionTime(newReactionTime);
                    numberofCommas = 0;
                    numberofPedestrians++;

                }
                else
                {
                    readCharacter = text.substring(index, index + 1);

                    readString = readString + readCharacter;
                }    
            } 


            // predict reaction time of person based on main speed level + provided parameters, reaction time (y=mx+c) x = (y-c)/m
            listofPeople.forEach(element => 
            {
        
                var getSpeed = element.getSpeed();
                var reactionTime;
        
                if (element.getPersonType() == "Old") 
                {
                    reactionTime = (getSpeed - oldPeopleRegression[1])/oldPeopleRegression[0];
                } 
                else if(element.getPersonType() == "Young") 
                {
                    reactionTime = (getSpeed - youngPeopleRegression[1])/youngPeopleRegression[0];
                }
                else
                {
                    reactionTime = (getSpeed - otherPeopleRegression[1])/otherPeopleRegression[0];
        
                }
        
                    
        
                element.setReactionTime(reactionTime); 
            });
    
        
            // output predictions by setting a speed for each dot and having its reaction time play once car gets 
        
            // in certain range, then when reaction time elapses, have them turn around
            // if there is a collision mention so else say successful avoidance
            // convert speed to pixels per frame
    
            // 
    
            animateModel(listofPeople);
        });


        // event fired when file reading failed
	    reader.addEventListener('error', function() {
	        alert('Error : Failed to read file');
	    });


    }
}







class Car
{
    Car()
    {
        this.Speed = 0;
        this.reactionTime = 0;


    }

    setSpeed(Speed)
    {
        this.Speed = Speed;
    }

    getSpeed()
    {
        return this.Speed;
    }

    setreactionTime(ReactionTime)
    {
        this.reactionTime = ReactionTime;
    }

    getreactionTime()
    {
        return this.reactionTime;
    }






}


class ParameterWeights // stores weights that each parameter effects reactionTime by
{
    ParameterWeights()
    {
        this.typePerson;
        this.weightDrunk;
        this.weightHealthy;
        this.weightRunning;
        this.weightWalking;
        this.weightTired;
        this.weightUnalert;

    }

    setWeightDrunk(weightDrunk)
    {
        this.weightDrunk = weightDrunk;
    }

    getWeightDrunk()
    {
        return this.weightDrunk;
    }

    setWeightHealthy(weightHealthy)
    {
        this.weightHealthy = weightHealthy;
    }

    getWeightHealthy()
    {
        return this.weightHealthy;
    }

    setWeightRunning(weightRunning)
    {
        this.weightRunning = weightRunning;
    }

    getWeightRunning()
    {
        return this.weightRunning;
    }

    setWeightWalking(weightWalking)
    {
        this.weightWalking = weightWalking;
    }

    getWeightWalking()
    {
        return this.weightWalking;
    }

    setWeightTired(weightTired)
    {
        this.weightTired= weightTired;
    }

    getWeightTired()
    {
        return this.weightTired;
    }

    setWeightUnalert(weightUnalert)
    {
        this.weightUnalert = weightUnalert;
    }

    getWeightUnalert()
    {
        return this.weightUnalert;
    }


}




class Pedestrian
{

    constructor(Speed, indreactionTime, indisDrunk, indisHealthy, indisRunning, indisTired, indisunalert, indisWalking, personType)
    {
        this.Speed = Speed;
        this.reactionTime = indreactionTime;
        this.isDrunk = indisDrunk;
        this.isHealthy = indisHealthy;
        this.isRunning = indisRunning;
        this.isTired = indisTired;
        this.isWalking = indisWalking;
        this.isunalert = indisunalert;
        this.personType = personType;
    }

    getSpeed()
    {
        return this.Speed;



    }

    setSpeed(speed)
    {
        this.speed = speed;


    }

    getPersonType()
    {
        return this.personType;


    }

    setReactionTime(reactionTime)
    {
        this.reactionTime = reactionTime;
    }

    getReactionTime()
    {
        return this.reactionTime;

    }

    getisWalking()
    {
        return this.isWalking;

    }

    getisRunning()
    {
        return this.isRunning;

    }

    getisDrunk()
    {
        return this.isDrunk;

    }

    getisHealthy()
    {
        return this.isHealthy;

    }

    getisunalert()
    {
        return this.isunalert;

    }

    getisTired()
    {
        return this.isTired;

    }

}





// Functions

// parse weight to be added and calculate weight
function CallWeights(weightToChange)
{
    if (weightToChange == 0) // drunk weight
    {
        return 1.25;
    } 
    else if (weightToChange == 1) // tired weight
    {
        return 1.35;
    }
    else if (weightToChange == 2) // running weight
    {
        return 1.1;
    }
    else if (weightToChange == 3) // walking weight
    {
        return 0.9;
    }
    else if (weightToChange == 4) // unalert weight
    {
        return 1.3;
    }
    else if (weightToChange == 5) // healthy weight
    {
        return 0.8;
    }

}

function createPerson(parameterSelect)
{
    var typePersonSelect = (Math.floor(Math.random()*150) + 150) % 2;


    if (parameterSelect == 0) 
    {
        typePersonSelect = (Math.floor(Math.random()*150) + 150) % 3;
        // determines type of person
        if (typePersonSelect == 0) 
        {
            return "Old";
        }
        else if(typePersonSelect == 1)
        {
            return "Young";
        }
        else
        {
            return "Other"
        }

    } 
    else if(parameterSelect == 1)
    {
        // determines whether a person is drunk or not
        if (typePersonSelect == 0) 
        {
            return "true";
        }
        else
        {
            return "false";
        }
    }
    else if(parameterSelect == 2)
    {
        // determines whether a person is tired or not
        if (typePersonSelect == 0) 
        {
            return "true";
        }
        else
        {
            return "false";
        }
        
    }
    else if(parameterSelect == 3)
    {
        // determines whether a person is unalert or not
        if (typePersonSelect == 0) 
        {
            return "true";
        }
        else
        {
            return "false";
        }
    }
    else if(parameterSelect == 4)
    {
        // determines whether a person is healthy or not
        if (typePersonSelect == 0) 
        {
            return "true";
        }
        else
        {
            return "false";
        }
    }
    else if(parameterSelect == 5)
    {
        // determines whether a person is walking or not
        if (typePersonSelect == 0) 
        {
            return "walk";
        }
        else
        {
            return "run";
        }
    }
}

function CalcSums(personList) // calculates the sums of the speed and reaction time to produce a slope and intercept for regression
{
    var xreactiontimeValues = [];
    var yspeedValues = [];

    // sum each person type using linear regression
    for (let index = 0; index < personList.length; index++) 
    {
        xreactiontimeValues.push(personList[index].getReactionTime());
        yspeedValues.push(personList[index].getSpeed());
    }


    var xSum=0, ySum=0, xxSum=0, xySum=0;
    var numberofPeople = xreactiontimeValues.length;
    for (let index = 0; index < numberofPeople; index++) 
    {
        xSum += xreactiontimeValues[index];
        ySum += yspeedValues[index];
        xxSum += xreactiontimeValues[index] * xreactiontimeValues[index];
        xySum += xreactiontimeValues[index] * yspeedValues[index];
    }



    var slope = (numberofPeople * xySum - xSum * ySum) / (numberofPeople * xxSum - xSum * xSum);
    var intercept = (ySum / numberofPeople) - (slope * xSum) / numberofPeople;


    return [slope, intercept];
}

function calculateSpeed(personType, isRunning)
{
    if (personType == "Old") 
    {
        if (isRunning == "run") 
        {
            return 3.4; // in meters/second
        } 
        else 
        {
            return 1.2; // in meters/second
        }
    } 
    else if (personType == "Young") 
    {
        if (isRunning == "run")  
        {
            return 6.3; // in meters/second
        } 
        else 
        {
            return 2; // in meters/second
        }
    }
    else
    {
        if (isRunning == "run")  
        {
            return 4.5; // in meters/second
        } 
        else 
        {
            return 1.6; // in meters/second
        }
    }
}

function calculateReactionTime(pedestrian, reactionWeights)
{

    // change weights to non zero for this to work
    var reactionTime = pedestrian.getReactionTime();
    var reactiontimeDrunk = reactionTime;
    var reactionTimeHealthy = reactionTime ;
    var reactionTimeTired = reactionTime;
    var reactionTimeUnalert = reactionTime;


    if (pedestrian.getisDrunk() == "true") 
    {
        reactiontimeDrunk = reactionTime * reactionWeights.getWeightDrunk();
    } 
    if (pedestrian.getisHealthy() == true)
    {
        reactionTimeHealthy = reactionTime * reactionWeights.getWeightHealthy();
    }
    if (pedestrian.getisTired() == true)
    {
        reactionTimeTired = reactionTime * reactionWeights.getWeightTired();
    }
    if (pedestrian.getisunalert() == true)
    {
        reactionTimeUnalert = reactionTime * reactionWeights.getWeightUnalert();
    }
    
    


    reactionTime = (reactiontimeDrunk + reactionTimeHealthy + reactionTimeTired + reactionTimeUnalert) / 4;
    
    return reactionTime;
}





// output predictions by setting a speed for each dot and having its reaction time play once car gets 
// in certain range, then when reaction time elapses, have them turn around
// if there is a collision mention so else say successful avoidance
// convert speed to pixels per frame

function animateModel(peopletoAnimate)
{
    // implement car animations as well
    var animationtimeCar = 7500; //change to car speed
    var carDistance = -1750;

    anime(
        {
            targets: document.getElementsByClassName('animationcar'),
            translateX: 
            [
                {value: carDistance, duration: animationtimeCar},
            ],
            easing: 'linear'
    
        });



    // calculate time = pixel distance / persons speed in pixels/second
    // calculate distance of person based on car time, distance = speed of person * car animation time

    for (let index = 0; index < peopletoAnimate.length; index++) 
    {

        var animationTime = 9000 / peopletoAnimate[index].getSpeed();
        var distance = 200;


        let person = "animation" + (index + 1).toString();
        anime(
            {
                targets: document.getElementsByClassName(person),
                translateY: 
                [
                    {value: distance, duration: animationTime},
                    {value: 0, duration: animationTime, delay: peopletoAnimate[0].getReactionTime()},
                ],
                easing: 'linear'
            });
        
        
    }
}


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
    var isDrunk = document.querySelector('input[name="drunk_parameter"]:checked').value;

    var isYoung = document.querySelector('input[name="young_parameter"]:checked').value;
    var isOld = document.querySelector('input[name="old_parameter"]:checked').value;

    var isTired = document.querySelector('input[name="tired_parameter"]:checked').value;
    var isDistraced = document.querySelector('input[name="distract_parameter"]:checked').value;
    var isHealthy = document.querySelector('input[name="health_parameter"]:checked').value;

    var isWalking = document.querySelector('input[name="walk_parameter"]:checked').value;
    var isRunning = "false";

    var typePerson = "";

    if (isWalking == "false") {
        isRunning = "true";
    }

    var personToAdd = "";

    if (isYoung == "true") 
    {
        typePerson = "Young";
    } else if(isOld == "true") 
    {
        typePerson = "Old";
        
    }
    else
    {
        typePerson = "Other";
    }



    if (isWalking == "true") 
        {
            personToAdd = isDrunk + "," + typePerson + "," + isTired + "," + isDistraced + "," + isHealthy + "," + "walk" + "," + " ";
        } 
        else 
        {
            personToAdd = isDrunk + "," + typePerson + "," + isTired + "," + isDistraced + "," + isHealthy + "," + "run"  + "," + " ";
        }




    



    for (let index = 2; index <= numberofPeople; index++) 
    {

        var drunkRadioButton = "drunk_parameter" + index.toString();
        var youngRadioButton = "young_parameter" + index.toString();
        var oldRadioButton = "old_parameter" + index.toString();
        var tiredRadioButton = "tired_parameter" + index.toString();
        var distractRadioButton = "distract_parameter" + index.toString();
        var healthRadioButton = "health_parameter" + index.toString();
        var walkRadioButton = "walk_parameter" + index.toString();

        

        isDrunk = document.querySelector('input[name=' + drunkRadioButton + ']:checked').value;
        isYoung = document.querySelector('input[name=' + youngRadioButton + ']:checked').value;
        isOld = document.querySelector('input[name=' + oldRadioButton + ']:checked').value;
        isTired = document.querySelector('input[name=' + tiredRadioButton + ']:checked').value;
        isDistraced = document.querySelector('input[name=' + distractRadioButton + ']:checked').value;
        isHealthy = document.querySelector('input[name=' + healthRadioButton + ']:checked').value;
        isWalking = document.querySelector('input[name=' + walkRadioButton + ']:checked').value;

        isRunning = "false";

        if (isWalking == "false") {
            isRunning = "true";
        }


        if (isYoung == "true") 
        {
            typePerson = "Young";
        } 
        else if (isOld == "true") 
        {
        typePerson = "Old";
        
        }
        else
        {
        typePerson = "Other";
        }



        if (isWalking == "true") 
        {
            personToAdd = personToAdd + isDrunk + "," + typePerson + "," + isTired + "," + isDistraced + "," + isHealthy + "," + "walk" + "," + " ";
        } 
        else 
        {
            personToAdd = personToAdd + isDrunk + "," + typePerson + "," + isTired + "," + isDistraced + "," + isHealthy + "," + "run" + "," + " ";
        }


    
        


    }
    
    
    download(personToAdd, "pedestrianData.txt", "text/plain")
}






















