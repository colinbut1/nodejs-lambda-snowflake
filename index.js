var snowflake = require('snowflake-sdk')
var AWS = require('aws-sdk')
var ssm = new AWS.SSM();

var usernameParams = {
    Name: '/snowflake/service-user/username',
    WithDecryption: false
};

var passwordParams = {
    Name: '/snowflake/service-user/password',
    WithDecryption: true
}

var snowflakeUsername;
ssm.getParameter(usernameParams, function(err, data){
    if (err)    console.error(err, err.stack);
    else        snowflakeUsername = data
});

var snowflakePassword;
ssm.getParameter(passwordParams, function(err, data){
    if (err)    console.error(err, err.stack);
    else        snowflakePassword = data
});

console.log('Fetched snowflake credentials from SSM, [username: ' + snowflakeUsername + ', password: ' + snowflakePassword + ']');

var connection = snowflake.createConnection({
    account: 'js_bank.eu-west-1.privatelink',
    username: snowflakeUsername,
    password: snowflakePassword,
    warehouse: 'JS_BANK',
    schema: 'AQM',
    database: 'AQM'
});

connection.connect(
    function(err, conn) {
        if (err) {
            console.error('Unable to connect to Snowflake: ' + err.message);
        } else {
            console.log('Successfully connected to Snowflake.');
        }
    }
);

var SQL_COMMAND = 'SELECT 1';

var statement = connection.execute({
    sqlText: SQL_COMMAND,
    complete: function(err, stmt, rows) {
        if (err) {
            console.error('Failed to execute statement due to the following error: ' + err.message);
        } else {
            console.log('Successfully executed SQL statement: ' + stmt.getSqlText());
            console.log('Rows returned: ' + rows.length);
            for (var i = 0; i < rows.length - 1; i++) {
                console.log(rows[i]);
            }
        }
    }
});

connection.destroy(function(err, conn){
    if (err) {
        console.error('Unable to disconnect: ' + err.message);
    } else {
        console.log('Disconnected connection with id: ' + connection.getId());
    }
});