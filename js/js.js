var givenToken = "";
var dropletti;
var sizes = [];

function Dropletti(id, name, status, cpus, memory, price, slug) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.cpus = cpus;
    this.memory = memory;
    this.price = price;
    this.slug = slug;
}
const setToken = () => {
    givenToken = document.getElementById("token").value;
    console.log(givenToken);
    getDropletData();
    getSizes();
}
const getDropletData = () => {
    sendHttpRequest('GET', 'https://api.digitalocean.com/v2/droplets')
        .then(responseData => {
            console.log(responseData);
            dropletti = new Dropletti(
                responseData.droplets[0].id,
                responseData.droplets[0].name,
                responseData.droplets[0].status,
                responseData.droplets[0].size.vcpus,
                responseData.droplets[0].size.memory,
                responseData.droplets[0].size.price_hourly,
                responseData.droplets[0].size_slug
            )
            document.getElementById("dropletsDisp").innerHTML = JSON.stringify(dropletti);
        })
        .catch(err => {
            console.log(err, err.data);
        });
};

const getBalanceBtn = document.getElementById('balance-btn');
const shutDownBtn = document.getElementById('shutdown-btn');
const resizeBtn = document.getElementById('resize-btn');
const powerOnBtn = document.getElementById('poweron-btn');



const sendHttpRequest = (method, url, data) => {
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.givenToken
        }
    }).then(response => {
        if (response.status >= 400) {
            return response.json().then(errResData => {
                const error = new Error('DO Avorion exploded?!');
                error.data = errResData;
                throw error;
            });
        }
        return response.json();
    });
};

const getBalance = () => {
    sendHttpRequest('GET', 'https://api.digitalocean.com/v2/customers/my/billing_history')
        .then(responseData => {
            console.log(responseData);
            document.getElementById("dropletsDisp").innerHTML = JSON.stringify(responseData);
        })
        .catch(err => {
            console.log(err, err.data);
        });
};

const getSizes = () => {
    sendHttpRequest('GET', 'https://api.digitalocean.com/v2/sizes')
        .then(responseData => {
            console.log(responseData);
            //TODO: make more flexible. Done in hurry
            for (var i = 0; i < 20; i++) {
                console.log(responseData.sizes[i].slug);
                sizes.push(responseData.sizes[i].slug);
            }
            console.log(sizes);
            var dropsizes = document.getElementById("dropsizes");
            for (var i = 0; i < sizes.length; i++) {
                var option = document.createElement("OPTION");

                option.innerHTML = sizes[i];
                dropsizes.options.add(option);
            }
            //document.getElementById("dropletsDisp").innerHTML = JSON.stringify(responseData);
        })
        .catch(err => {
            console.log(err, err.data);
        });
};

const shutDown = () => {
    var json = {
        "type": "shutdown"
    };
    sendHttpRequest('POST', '/v2/droplets/' + dropletti.id + '/actions', json)
        .then(responseData => {
            console.log(responseData)
        })
        .catch(err => {
            console.log(err, err.data);
        });
};

const reSize = () => {
    var selectedSize = document.getElementById("dropsizes");
    var selection = selectedSize.options[selectedSize.selectedIndex].value;
    var json = {
        "type": "resize",
        "disk": false
    };
    json.size = selection;
    console.log(json)
    var confirmationResult = confirm("Really resize to: " + selection + " ?")
    if (confirmationResult == true) {
        console.log("resize nao")
        sendHttpRequest('POST', '/v2/droplets/' + dropletti.id + '/actions', json)
            .then(responseData => {
                console.log(responseData)
            })
            .catch(err => {
                console.log(err, err.data);
            });
    } else {
        console.log("no resize plz")
    }

};

const powerOn = () => {
    var json = {
        "type": "power_on"
    };
    sendHttpRequest('POST', '/v2/droplets/' + dropletti.id + '/actions', json)
        .then(responseData => {
            console.log(responseData)
        })
        .catch(err => {
            console.log(err, err.data);
        });
};

getBalanceBtn.addEventListener('click', getBalance);
shutDownBtn.addEventListener('click', shutDown);
resizeBtn.addEventListener('click', reSize);
powerOnBtn.addEventListener('click', powerOn);