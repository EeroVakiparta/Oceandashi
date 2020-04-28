var givenToken = "";
var dropletti;
var sizes = [];
var dropTable = document.getElementById("dropletsTable");
var header = dropTable.createTHead();
var headerValues = ["Id", "Name", "Status", "CPUs", "Memory", "Price", "size"];
var row = header.insertRow(0);
for (var i = 0; i < 7; i++) {
    var cell = row.insertCell(i);
    cell.innerHTML = headerValues[i];
}

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
    //console.log(givenToken);
    getDropletData();
    getSizes();
    getBalance();
}
const getDropletData = () => {
    sendHttpRequest('GET', 'https://api.digitalocean.com/v2/droplets')
        .then(responseData => {
            //console.log(responseData);
            dropletti = new Dropletti(
                responseData.droplets[0].id,
                responseData.droplets[0].name,
                responseData.droplets[0].status,
                responseData.droplets[0].size.vcpus,
                responseData.droplets[0].size.memory,
                responseData.droplets[0].size.price_hourly,
                responseData.droplets[0].size_slug
            )
            //document.getElementById("dropletsDisp").innerHTML = JSON.stringify(dropletti);

            for (var i = 1; i < dropTable.rows.length;) {
                dropTable.deleteRow(i);
            }
            //TODO: done after midnight refactor
            var tempArr = [];
            var tempValues = [];
            for (var k in dropletti) {
                tempArr.push(k);
                if (dropletti.hasOwnProperty(k)) {
                    var value = dropletti[k];
                    tempValues.push(value);
                }
            }
            //console.log(tempArr);
            var isActive = false;
            var row = dropTable.insertRow(-1);
            for (var i = 0; i < tempArr.length; i++) {
                var cell = row.insertCell(i);
                var valuee = tempValues[i];

                if (valuee == "active") {
                    isActive = true;
                }
                cell.innerHTML = valuee;
            }
            var something;
            if (isActive) {
                something = document.getElementById("statusLight").style.backgroundColor = "green";
            } else {
                something = document.getElementById("statusLight").style.backgroundColor = "red";
            }
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
            'Authorization': 'Bearer ' + this.givenToken,
         //   'Accept': 'application/json'//,
          //  'Origin':'http://localhost:3000'
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
    sendHttpRequest('GET', 'https://api.digitalocean.com/v2/customers/my/balance')
        .then(responseData => {
            //console.log(responseData);
            //TODO:refactor done on bus
            var accountBalance = JSON.stringify(responseData.month_to_date_balance);
            accountBalance = accountBalance.replace('-','').replace(/"/g,'') + "€";
            document.getElementById("balanceDisp").innerHTML = accountBalance;
        })
        .catch(err => {
            console.log(err, err.data);
        });
};

const getSizes = () => {
    sendHttpRequest('GET', 'https://api.digitalocean.com/v2/sizes')
        .then(responseData => {
            //console.log(responseData);
            sizes = [];
            for (var i = 0; i < responseData.sizes.length; i++) {
                //console.log(responseData.sizes[i].slug);
                sizes.push(responseData.sizes[i].slug);
            }
            //console.log(sizes);
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
    sendHttpRequest('POST', 'https://api.digitalocean.com/v2/droplets/' + dropletti.id + '/actions', json)
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
        sendHttpRequest('POST', 'https://api.digitalocean.com/v2/droplets/' + dropletti.id + '/actions', json)
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
    sendHttpRequest('POST', 'https://api.digitalocean.com/v2/droplets/' + dropletti.id + '/actions', json)
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