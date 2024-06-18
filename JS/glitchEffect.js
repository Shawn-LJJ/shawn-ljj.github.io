// the only part where I taken from the internet is the sleep function, the calling of the sleep function with the await keyword
// and adding async into the glitchTransition function

// this function will generate glitch-like effect when transitioning from a new text to another, or when the text first pop up
async function glitchTransition(htmlLocation, newText, originalText="")
{
    // the number of cycles depends on the difference in the length of the previous and the current text being generated
    // use a logarithmic function so that if the difference get larger, the cycles will not increase linearly, or else it can take really long
    const LENDIFF = newText.length - originalText.length;
    const RANDOMVALUE = Math.floor((Math.random() * 5) + 7);
    var cycles = Math.floor(RANDOMVALUE * Math.log10(5 * (Math.abs(LENDIFF) + 1)));
    // cycles are the number of times the text change into a new text

    const LENCHANGEPERCYCLE = LENDIFF / cycles; // difference in length per cycle, so that each cycle will increment/decrement the length of text
    var lengthOfCurrentText = originalText.length; // get the length of original text, to set as the starting point for generating
    for (let cycle = 1; cycle <= cycles; cycle++)
    {
        // increment/decrement the length of text. Although it might not be in integer, it will be added or subtract with random number and round it to give a random length while incrementing or decrementing
        lengthOfCurrentText += LENCHANGEPERCYCLE;
        let currentCycleLen = Math.floor(lengthOfCurrentText + ((Math.random() * (Math.log10(lengthOfCurrentText + 1) * 5)) - (Math.log10(lengthOfCurrentText + 1) * 5)/ 2));

        // this probability variable determine the chance that a character used for the glitching effect will be from the new text
        let probability = (cycle / (cycles + 1)) ** 3;

        var text = "";  // use to store the text for the current cycle
        for (let charIndex = 0; charIndex < currentCycleLen; charIndex++)
        {
            if (probability > Math.random() && newText.length > charIndex)
            {
                text += newText[charIndex];
            }
            else
            {
                text += String.fromCharCode((Math.random() * 95) + 32); // if the character generated is not from the new text, generate a random readable character from ASCII  
            }
        }
        // once the text is created, assign it to the content of the htmlLocation element, where htmlLocation is the ID of the element
        document.getElementById(htmlLocation).innerHTML = text;
        await sleep(100);   // the sleep function will pause the program for 100ms, otherwise the program will run fast enough that the user will not be able to notice the transition
    }
    document.getElementById(htmlLocation).innerHTML = newText;  // once all the cycles are completed, write the actual text to the element
}

// the sleep function is copied from https://www.tutorialspoint.com/javascript-sleep-function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function showNavBar()
{
    // even number index is the name, odd number index is the HTML location of the previous index page
    const LINKS = ['Home', 'index.html', 'School', 'school.html', 'Career', 'career.html', 'Feedback', 'feedback.html'];

    // check the nav bar if there's any content. If there is content, then proceed to hide the nav bar. Otherwise, display the nav bar
    var displayIt;      // this variable will determine whether to display or hide the nav bar. True = display nav bar. False = hide the nav bar
    if (document.getElementById("navBar").innerHTML.length == 0)    // for the beginning when the whole ul element does not exists yet, then proceed to display the nav bar
    {
        displayIt = true;
    }
    else
    {
        // if the ul element already exists, check the home ID element if there's any content within that element. If there's content, then hide, or else, display the nav bar
        if (document.getElementById("Home").innerHTML.length == 0)
        {
            displayIt = true;
        }
        else
        {
            displayIt = false;
        }
    }

    if (displayIt)
    {
        // if displayIt is true, then write all the whole ul element with all the list of nav links to the navBar element, and generate the text with glitchTransition()
        var htmlCode = `<ul class="nav text-center h2 row">`;
        for (let i = 0; i < LINKS.length; i += 2)
        {
            htmlCode += `
            <li class="nav-item col-md-3">
                <a class="nav-link text-decoration-none" href="./${LINKS[i + 1]}" id="${LINKS[i]}">
                </a>
            </li>`
        }
        htmlCode += `</ul>`
        document.getElementById("navBar").innerHTML = htmlCode;
        // loop through each nav name, proceed to generate the nav link after writing the html code to the navBar element
        for (let i = 0; i < LINKS.length; i += 2)
        {
            setTimeout(glitchTransition(LINKS[i], LINKS[i]), 0);
        }
    }
    else
    {
        // if displayIt is false, proceed to disintegrate the text into nothing
        for (let i = 0; i < LINKS.length; i += 2)
        {
            setTimeout(glitchTransition(LINKS[i], "", LINKS[i]), 0);
        }
    }
}


// this function will only be called at index.html to generate the text and display glitch transition
function triggerIndexHeader()
{
    // once the index is loaded up and triggered this function, display a welcome message first
    glitchTransition("header-text", "Welcome to my career portfolio!");
    sleep(7500);    // sleep first to let the user read the welcome message
    var previousOption = -1;    // this variable will check if the next sentence to generate coincides with the current sentence on display, -1 is set as default because I will not display the welcome message again
    // create an anonymous function that will regenerate a new sentence on the header every 5 seconds
    setInterval(function(){
        // a list of sentences that will be used to display
        const LISTOFSENTENCES = [
            "Fun fact: This is a fun fact.",
            "Take your time looking around!",
            "This sentence is a lie.",
            `Here's a random integer from 0 to 9999: ${Math.floor(Math.random() * 10000)}`
        ]
        do
        {
            var choice = Math.floor(Math.random() * (LISTOFSENTENCES.length ));     // generate a random number to display a random sentence
        } while (choice == previousOption)      // if the generated sentence is the same as the current sentence, iterate and regenerate until it is no longer the same

        previousOption = choice;        // set the new sentence generated as the current one, to be used to check if the next sentence will still be the same 

        glitchTransition("header-text", LISTOFSENTENCES[choice], document.getElementById("header-text").innerHTML);     // proceed to generate the text
    }, 5000);
}

// this function will trigger when user click on the selected career option on the image map under the career page
function generateCareerText(option)
{
    // using an object to store all the career choices and their following list of info
    const texts = {
        'ad' : ['Application Development', `The job of an application developer is to outline the specification -- the requirement that the entire program must met.
        Followed by the actual writing of the computer code, and finally run test and debug any issues. Application developer also have to maintain and
        troubleshoot the programs if any issue arises.`, '$4,743 per month', `Analytical thinking, problem solving skills, time management,
        commmunication and teamwork skills, and great attention to details.`],
        'cs' : ['Computer Scientist', `Computer scientist work on the theoretical aspect of computing. The main purpose is to solve problems with the understanding
        of how computer works and how information are passed and processed. Computer scientists will work on develop new software, programming languages to help make
        computers and subsequently businesses run more efficiently.`, '$10,513 per month', `Mathematical skills, project management, analytical thinking, problem-solving,
        critical thinking, creativity, and teamwork and communication skills`],
        'ds' : ['Data Scientist', `Data scientist work to manipulate the data and create algorithm and models to predict and answer questions for busineses.
        As data scientist, he or she can make use of programming skills to create code and models to predict scenarios based on the data at hand.
        It can involve the use of machine learning to help make better prediction to assists our theories and hypothesises.`, 
        '$7,373 per month', `Analytical thinking, commmunication and teamwork skills, critical thinking, problem solving skills`],
        'ai' : ['AI Engineer', `AI developer will be making use of software tools and coding to create an AI algorithm to intelligently makes decision for the user and businesses. 
        AI developer will work with people from similar domain to develop and maintain AI systems for their clients.`, 
        '$5,000 per month', `Problem solving skill, analytical thinking, critical thinking, and quick thinking.`]
    }

    // a list of ID of elements that correspond to the list of info within the object
    const LISTOFELEMENTIDS = ['career-text-header', 'career-text-desc', 'career-text-salary', 'career-text-skills'];

    // for each ID in the list, generate the text "mapped" to the ID
    for (let i = 0; i < 4; i++)
    {
        glitchTransition(LISTOFELEMENTIDS[i], texts[option][i], document.getElementById(LISTOFELEMENTIDS[i]).innerHTML);
    }
}