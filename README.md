# nodejs-lambda-snowflake
This is just a sample lambda (built in nodejs) that connects to snowflake

## Build

```bash
npm build
```

## Deploy

```bash
zip -r function.zip . && \
AWS_PROFILE=__AWS_PROFILE__ aws lambda update-function-code --function-name nodejs-lambda-snowflake --zip-file fileb://function.zip
```
