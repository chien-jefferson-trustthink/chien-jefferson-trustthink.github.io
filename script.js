var map;
let popup, Popup;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                infoWindow.setPosition(pos);
                infoWindow.setContent("Location found.");
                infoWindow.open(map);
                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}
// https://jefferson-geodata-visualization.s3.amazonaws.com/violation.json
function button_clicked(button_id) {
    console.log("in button clicked function");
    if (button_id === "submit") {
        serial_number = document.getElementById("serial_number_input1").value;
        console.log("button1_clicked");

        // var table = document.getElementById("geo_violation_table");
        // var new_row = table.insertRow(1);
        // new_row.id = "table_row";
        // var my_latitude = new_row.insertCell(0);
        // var my_longitude = new_row.insertCell(1);
        // var my_time = new_row.insertCell(2);
        // my_latitude.innerHTML = "100";
        // my_longitude.innerHTML = "200";
        // my_time.innerHTML = "300";
        // getGeoViolationSize(serial_number);

        fetch('https://jefferson-geodata-visualization.s3.amazonaws.com/data_log.json').then(function(response) {
            return response.json();
        }).then(function(obj) {
            var lat_center = obj[0]["lat"];
            var lng_center = obj[0]["lng"];
            var map_center = { lat: lat_center, lng: lng_center };

            map.setOptions({
                center: map_center,
                zoom: 11
            });

            const path = new google.maps.Polyline({
                path: obj,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            path.setMap(map);
            console.log(obj)

        }).catch(function(error) {
            console.log("something went wrong");
            console.log(error);
        });


        fetch('https://jefferson-geodata-visualization.s3.amazonaws.com/violation.json').then(function(response) {
            return response.json();
        }).then(function(obj) {
            var lat_center = obj[0]["lat"];
            var lng_center = obj[0]["lng"];
            var map_center = { lat: lat_center, lng: lng_center };

            for (var i = 0; i < Object.keys(obj).length; i++) {
                var point = new google.maps.LatLng(obj[i]["lat"], obj[i]["lng"]);
                var marker = new google.maps.Marker({
                    position: point,
                    map: map
                });
            }

            var table = document.getElementById("geo_violation_table");

            for (var i = 0; i < Object.keys(obj).length; i++) {
                var new_row = table.insertRow(1);
                var my_latitude = new_row.insertCell(0);
                var my_longitude = new_row.insertCell(1);
                var my_time = new_row.insertCell(2);

                // Convert epoch time to time
                var date = new Date(0);
                date.setUTCSeconds(obj[i]["time"]);

                my_latitude.innerHTML = obj[i]["lat"];
                my_longitude.innerHTML = obj[i]["lng"];
                var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                my_time.innerHTML = month[date.getMonth()] + " " + date.getDay() + " " + date.getHours() + ":" + date.getUTCMinutes() + ":" + date.getSeconds();
            }

            class Popup extends google.maps.OverlayView {
                constructor(position, content) {
                        super();
                        this.position = position;
                        content.classList.add("popup-bubble");
                        // This zero-height div is positioned at the bottom of the bubble.
                        const bubbleAnchor = document.createElement("div");
                        bubbleAnchor.classList.add("popup-bubble-anchor");
                        bubbleAnchor.appendChild(content);
                        // This zero-height div is positioned at the bottom of the tip.
                        this.containerDiv = document.createElement("div");
                        this.containerDiv.classList.add("popup-container");
                        this.containerDiv.appendChild(bubbleAnchor);
                        // Optionally stop clicks, etc., from bubbling up to the map.
                        Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
                    }
                    /** Called when the popup is added to the map. */
                onAdd() {
                        this.getPanes().floatPane.appendChild(this.containerDiv);
                    }
                    /** Called when the popup is removed from the map. */
                onRemove() {
                        if (this.containerDiv.parentElement) {
                            this.containerDiv.parentElement.removeChild(this.containerDiv);
                        }
                    }
                    /** Called each frame when the popup needs to draw itself. */
                draw() {
                    const divPosition = this.getProjection().fromLatLngToDivPixel(
                        this.position
                    );
                    // Hide the popup when it is far out of view.
                    const display =
                        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
                        "block" :
                        "none";

                    if (display === "block") {
                        this.containerDiv.style.left = divPosition.x + "px";
                        this.containerDiv.style.top = divPosition.y + "px";
                    }

                    if (this.containerDiv.style.display !== display) {
                        this.containerDiv.style.display = display;
                    }
                }
            }


            for (var i = 0; i < Object.keys(obj).length; i++) {
                var new_div = document.createElement('div');
                new_div.id = ("pop_up_div" + i);
                var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                new_div.innerHTML = month[date.getMonth()] + " " + date.getDay();
                document.getElementById("pop_ups").appendChild(new_div);

                popup = new Popup(
                    new google.maps.LatLng(obj[i]["lat"], obj[i]["lng"]),
                    document.getElementById(("pop_up_div" + i))
                );

                popup.setMap(map)

            }

            console.log(obj)

        }).catch(function(error) {
            console.log("something went wrong");
            console.log(error);
        });



    } else if (button_id == "search") {
        var list = document.getElementById("serial_numbers_select");
        var new_option = document.createElement("option");
        new_option.text = "testing";
        new_option.id = "options";
        list.add(new_option, 0);
        console.log("button2 clicked");

    }

}

function getGeoViolationSize(serial_number) {
    var settings = {
        "url": "https: //u0ic3e50kv-u0me9cmixf-connect.us0-aws.kaleido.io/instances/geomanagementv15/getGeoViolationSize?kld-from=0xa38f7ce1f353a8B11c5bd1B2da6BE7EfF405b3c9",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Basic dTBuNzR5Y3lhOTpYYm8zbWFvdzhzN0hZcGh3ekE3UDdteVYxUXRmdVFtTGFkck1IMDNMX0E4",
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({ "my_serial_number": serial_number }),
    };
    $.ajax(settings).done(function(response) {
        console.log(response);
    });
}

function getGeoViolationData(serial_number, size) {
    for (var i = 0; i < size; i++) {

    }
}