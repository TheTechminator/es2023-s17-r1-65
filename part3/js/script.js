function dragStartHandler(ev) {
    ev.target.id = Math.round(Math.random()*100000);
    ev.dataTransfer.setData("application/my-app", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
}

function dragOverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move"
}

function dropHandler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("application/my-app");
    let destinationElementText = ev.target.innerHTML;
    ev.target.innerHTML = document.getElementById(data).innerHTML;
    document.getElementById(data).innerHTML = destinationElementText;
    autoSaveChanges();
}

function addEventsToGirds () {
    let elements = document.getElementsByClassName("grid-item");
    for(let i = 0; i<elements.length; i++) {
        elements[i].addEventListener("dragstart", dragStartHandler);
        elements[i].addEventListener("input", gridModifiedHandler);
    }
}

function gridModifiedHandler (e) {
    autoSaveChanges();
}

function drawGridLayout (data) {
    let htmlData = "";

    for(let i = 0; i<32; i++) {
        htmlData += `<div class="grid-item" draggable="true" contenteditable="true">${(data[i] ? data[i] : "")}</div>`;
    }

    document.getElementById("target").innerHTML = htmlData;
}

function autoSaveChanges () {
    let VIPs = "";
    let grids = document.getElementsByClassName("grid-item");

    for(let i = 0; i<grids.length; i++) {
        VIPs += grids[i].innerHTML + ";"; 
    }

    sessionStorage.setItem('VIPs', VIPs);
}

function displayGridLayout (data) {
    drawGridLayout((data ? data : []));
    addEventsToGirds();
}

function constructVIPListFromFileData (data) {
    let lines = data.split("\r\n");

    let VIPs = [];

    for(let i = 2; i<lines.length; i++) {
        VIPs.push(lines[i].substring(2));
    }

    return VIPs;
}

window.addEventListener('DOMContentLoaded', () => {
    if(sessionStorage.getItem("VIPs")) {
        let data = sessionStorage.getItem("VIPs").split(";");
        displayGridLayout(data);
    } else {
        displayGridLayout();
    }
});

document.getElementById("btLoadSample").addEventListener("click", () => {
    drawGridLayout(["Andrew", "Robert", "Steve"]);
    addEventsToGirds();
    sessionStorage.clear();
    autoSaveChanges();
});

/*document.getElementById('inputFile').addEventListener('change', function() {
    readFileData(this.files[0]);
})*/

let fullScreenArea = document.getElementById("fullScreenArea");
let isFullscreen = false;
let btFullscreen = document.getElementById("btFullscreen");
btFullscreen.addEventListener("click", (e) => {
    if(isFullscreen) {
        document.exitFullscreen();
    } else {
        fullScreenArea.requestFullscreen();
    }
});

addEventListener('fullscreenchange', (e) => {
    if(document.fullscreenElement) {
        isFullscreen = true;
        btFullscreen.innerHTML = `<i class="fa fa-compress"></i>`;
    } else {
        isFullscreen = false;
        btFullscreen.innerHTML = `<i class="fa fa-expand"></i>`;
    }
});


function createExportableListFromVIPs () {
    let VIPs = [];
    let lastVipIndex = 1;
    let grids = document.getElementsByClassName("grid-item");

    VIPs[0] = "# VIP List";
    VIPs[1] = "";

    for(let i = 0; i<grids.length; i++) {
        VIPs[2+i] = "- " + grids[i].innerHTML;

        if(grids[i].innerHTML != "") {
            lastVipIndex = 2+i;
        }
    }

    VIPs.length = lastVipIndex+1;

    return VIPs.join("\r\n");
}

function updateClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(function() {
        showCopyToClipSuccessDialog();
    }, function() {
        /* clipboard write failed */
    });
}

btCopyToClipboard.addEventListener("click", (e) => {
    updateClipboard(createExportableListFromVIPs());
});

function createAndDownloadFile(content, fileName) {
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([content], {type: "text/plain"}));
    a.download = fileName;
    a.click();
}

btDownload.addEventListener("click", (e) => {
    createAndDownloadFile(createExportableListFromVIPs(), "vip-list.txt");
});



let dialogs = document.getElementsByClassName("dialog");

btExporting.addEventListener("click", (e) => {
    exportDialog.style = "";
});

for(let i = 0; i<dialogs.length; i++) {
    dialogs[i].addEventListener("click", (e) => {
        dialogs[i].style = "display: none;";
    })
}

function showCopyToClipSuccessDialog () {
    copySuccessDialog.style = "";

    setTimeout(() => {
        copySuccessDialog.style = "display: none;"
    }, 1000);
}


function fileDropHandler(ev) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        if (ev.dataTransfer.items[0].kind === 'file') {
            readFileData(ev.dataTransfer.items[0].getAsFile());
        }
    } else {
        readFileData(ev.dataTransfer.files[0]);
    }

    fileDragDialog.style = "display: none;";
    fileDropZone.innerHTML = "Drag your file here";
    fileDropZone.style = "";
}

function fileDragOverHandler(ev) {
    fileDropZone.innerHTML = "Drop it";
    fileDropZone.style = "border-color: lightgreen; color: lightgreen;"
    ev.preventDefault();
}

function fileDragLeaveHandler(ev) {
    fileDropZone.innerHTML = "Drag your file here";
    fileDropZone.style = "";
    ev.preventDefault();
}

function readFileData (file) {
    var fr=new FileReader();
    fr.onload=function(){
        displayGridLayout(constructVIPListFromFileData(fr.result));
        autoSaveChanges();
    }
    
    fr.readAsText(file);
}