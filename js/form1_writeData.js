// WRITE OPTION
// authorization data for service account(sheets api)
const authData = {
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDi3v/0V2BVJdmZ\nqxCpau4GraV8qtzdgUtfNtUsp8UfZ3R3pHvsTAn0tAAqFRwQC2BlQYJ808d8RLVc\nyQ6aNRrLpim4OE3rR7y56KZIAsJ1pMfafTJZU/C8O6ge+WSjeNZo26ayxjZjdW5S\nqpMXJH+3O3CH4aFfFhgBrS9wclNOpw4mBkxFlNI6unSmxQ+gMujLJZbBu7nxLxWh\nCsty0rlQ0IRJJtQ9AtJRVcBTC/OXQo3pqz1+IdqK3sP2k+2G1Zy7UOCUAE/IpT+F\n/7+KvrHGCEqnqp6CoZ+CA/yuGh1h2gp3reaiaVCn+OZ+k4CUqzx5zXXAVAQfJNa2\nBF8/wEXPAgMBAAECggEAA3YzoZ7TsXjqYRXjIzKmfyOXKtfQlvCqHcHQbuYAdAI4\nHLs9yNVAMaOtfPblfrktt13Qh+cTXCoQOmI2/tNgnUrjyBPT3IszrgKGxwKDxRfG\nlObkJcjKG5Utc4uKpZPqcZ8oZAHyQoJANLK1m9zKthkKFoiy1aiYpS3nU2frLYAH\nsxHsJ8QYrua93QNdmuMh5azQ+/Krf2/23x0C4EYhlGz+hpIIaOC3YUip4TRvUemW\nsKkU1NRI8ycVbTQJYJCdJtMsb1/SM2aXmAnpLaJvDrqsDRMw5yq4b3j8VfD55HtE\nWuwM2GN8As6up95dIQblpxRh5dBNZMUweDMOVnj+AQKBgQD6bWvMTXrIqox7a0xo\n6Hs4W8s8jo9X9yA4ZcYPujzWYdgLmQw4avj2pHS+/HJi0CTNVaNxJcAyDa1Gpfoe\nQ5velpeanE6IzvecUOvK4KghVSTDdTRTob3Ckar0V79LLQpZsbiPi2Abajmv1OMO\nEUz3mpIV7MlZvoLAWzWvsE71bwKBgQDn62Nm9f1AF36sfr2c7MbZMDG8TujwzB2i\nE1zMzM7Bgsqo7WalULnrjBmKE3KE6bMaHU4SgxqL9gRJBHNC0hNqUbJLdZSzt/B0\ndC5Epx2OGGHK2ItKRlzL/lHp5FrdGN3P9PVmVnCHmTerxROFGeO6ID84WiV+EiXd\nrd9xup9FoQKBgHbjRZ77VYQ4e3MIUIEphX4PDiBUqbagKtq7blj/GGzKjK+M3CFY\nn5MwJgCZhpBksmQM+Qf5XRImLhHxMBn4DOKSaazL8fi/EQxT2m05VHhmnIpydQIT\nMixRzXAszDMbUeOdHLqA94JsXrCcB6MhEYInDp18CWciq544bvdWY1XfAoGBAIOd\n8c634d6ittAcKW3KbltJ35/3xHkLzfFyPaM4xEnL+Ul/WVaOhsTnwIK84KwPmQZE\nBU+6ObGej/YEYYlVgZFABgiPFTIdPIhKewuZL8u5iJ4+4GXporZegYxUfUCm4RMo\n+K/4dGpwCMkh0h8ifzvdGyPW/RocIIM7LujzOXqhAoGBAPJLafwOA6M/PFui9hiC\nW9KKQoSQBDnRogCfcClfRfnrWdjnq2SlpbCah3Swo4JGxGQsb13TSZ1+X/SuvOHY\nO2PLtuLIdY/L07vg+EkTNuJdmDc5Pdly8yqei6iUVMxl3qnThoUHd9eXKPkX7ZQb\nFuiqLrTLBoaRoiEcdZOdQVCm\n-----END PRIVATE KEY-----\n",
    client_email: "bubservice@bub-project.iam.gserviceaccount.com",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
};




// when qapi loaded -> get and save access token
const handleClientLoad = () => {
    gapi.load("client", async () => {
        var token = await GetAccessTokenFromServiceAccount.do(authData);
        gapi.auth.setToken(token);
        document.getElementById("btnRun").disabled = false;
    });
}


// on run clicked
function run() {
    if(!document.forms['form1'].reportValidity()) return;

    gapi.client
        .init({
            discoveryDocs: [
                "https://sheets.googleapis.com/$discovery/rest?version=v4",
                //"https://discovery.googleapis.com/discovery/v1/apis",
            ],
        })
        .then(() => {
            // Collecting data for spreadsheets.values.append request
            let appendRequestData = {
                "spreadsheetId": "1wkLqyJGsfruUrbtFuCQ59gH1VqXfKi8XQUOwZTxzQPE",
                "range": "A:D",
                "includeValuesInResponse": true,
                "valueInputOption": "RAW",
                "resource": {
                    "majorDimension": "ROWS",
                    "range": "A:D",
                    "values": collectFormValuesArray()
                }
            };


            gapi.client.sheets.spreadsheets.values.append(appendRequestData)
                .then((response) => {
                    console.log("append values response: ", response.result);
                });
        });
}


function collectFormValuesArray() {
    let form = document.forms['form1'];
    const formData = new FormData(form);
    
    return [
        [
            formData.get("fname"),
            formData.get("email"),
            formData.get("subj"),
            formData.get("mestxt")
        ]
    ];
}