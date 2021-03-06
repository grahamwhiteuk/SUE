document.addEventListener('DOMContentLoaded', skipTime(), false);

function changeTime(checkbox) {
    if (checkbox.checked) {
        activeTime();
    } else {
        skipTime();
    }
}

function activeTime() {
    clearMap();

    window.datetime = new Date("2020-03-04T16:10:10Z");
    window.cendtime = new Date("2020-03-04T16:11:05Z");

    const skipSwitch = document.getElementById("skipSwitch");

    getAllSensorMarkers(function (data) {
        window.sensorlst = data;
        let sensorlist = window.sensorlst;

        for (let i in sensorlist) {
            let sensor = sensorlist[i];

            if (skipSwitch.checked == false) {
                clearInterval(refreshId);
            } else {
                if (sensor.properties.sensorType === "Camera") {
                    addMarker(sensor, cameraIcon);
                } else if (sensor.properties.sensorType === "Human") {
                    addMarker(sensor, humanIcon);
                } else {
                    addMarker(sensor, microphoneIcon);
                }

                //addListItem(sensor, "Sensor", sensor.properties.sensorType);
            }
        } 
    });

    let refreshId = setInterval( function() { 

        if (skipSwitch.checked == false) {
            clearInterval(refreshId);
        }

        window.datetime.setSeconds( window.datetime.getSeconds() + 5 );
               
        getEventMarkers(function (data) {

            if ( data != window.eventlst ) {

                window.eventlst = data;
                let eventlist = window.eventlst;

                for ( let i in eventlist ) {
                    let event = eventlist[i];

                    if (skipSwitch.checked == false) {
                        clearInterval(refreshId);
                    } else {
                        addMarker(event, null);
            
                        //addListItem(event, "Event", event.properties.eventType);
                    }
                } 
            }
        });

        if (window.datetime <= window.cendtime) {
            getComplexEvents(function (data) {

                if ( !compareList(data, window.complexlst) ) {

                    window.complexlst = data;
                    let complexlist = window.complexlst;

                    if ( complexlist.length > 0 ) {
                        refreshComplex();
                    }

                    let refinedList = refineList(complexlist);

                    for ( let i in refinedList ) {
                        let complex = refinedList[i];

                        if (skipSwitch.checked == false) {
                            clearInterval(refreshId);
                        } else {

                            processComplexEvent(complex);

                            //addListItem(complex, "Complex", null);
                        }
                    } 
                }
            });
        }
    }, 5000);
}

function skipTime() {

    window.complexTime = 600;
    window.complexDist = 90;

    clearMap();
     
    getAllSensorMarkers(function (data) {
        window.sensorlst = data;
        let sensorlist = window.sensorlst;

        for ( let i in sensorlist ) {
            let sensor = sensorlist[i];

            if (sensor.properties.sensorType === "Camera") {
                addMarker(sensor, cameraIcon);
            } else if (sensor.properties.sensorType === "Human") {
                addMarker(sensor, humanIcon);
            } else {
                addMarker(sensor, microphoneIcon);
            }

            //addListItem(sensor, "Sensor", sensor.properties.sensorType);
        } 
    });

    getAllEventMarkers(function (data) {
        window.eventlst = data;
        let eventlist = window.eventlst;
        
        for ( let i in eventlist ) {
            let event = eventlist[i];
        
            addMarker(event, null);
        
            //addListItem(event, "Event", event.properties.eventType);
        } 
    });

    getAllComplexEvents(function (data) {
        window.complexlst = data;
        let complexlist = window.complexlst;

        let refinedList = refineList(complexlist);

        for ( let i in refinedList ) {
            let complex = refinedList[i];

            processComplexEvent(complex);

            //addListItem(complex, "Complex", null);
        } 
    });

    buildStaticCharts();

    window.critPriorityEventRange.addTo(window.leafletmap);
    window.highPriorityEventRange.addTo(window.leafletmap);
    window.medPriorityEventRange.addTo(window.leafletmap);
    window.lowPriorityEventRange.addTo(window.leafletmap);

    window.sensorCameraRange.addTo(window.leafletmap);
    window.sensorMicrophoneRange.addTo(window.leafletmap);
    window.sensorHumanRange.addTo(window.leafletmap);

    window.sensorCamera.addTo(window.leafletmap);
    window.sensorMicrophone.addTo(window.leafletmap);
    window.sensorHuman.addTo(window.leafletmap);

    window.critPriorityEvent.addTo(window.leafletmap);
    window.highPriorityEvent.addTo(window.leafletmap);
    window.medPriorityEvent.addTo(window.leafletmap);
    window.lowPriorityEvent.addTo(window.leafletmap);

    window.complexEvent.addTo(window.leafletmap);
}