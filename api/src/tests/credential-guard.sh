#!/bin/bash

# Ignore non-confidential env
ignoreEnvList="
Location
BASE_URL
"

# Get file list and env list
fileList=$(git ls-files)
expectedEnv=$(cat .env.example  | grep "=" | awk -F '=' '{print $1}')

# Check if is currently running in CI
if [ $CI ];then
    echo "Is CI!"
else
    echo "Is local"
    export $(egrep -v '^#' .env | xargs) # Import local env file
fi

# Result val default at 0(success)
returnVal=0

for env in $expectedEnv; do
    # Ignore if env is in ignoreEnvList
    checkIgnore=$(grep "^$env$" <<< $ignoreEnvList)
    if [ "$checkIgnore" != "" ];then
        continue
    fi

    credential=$(printenv $env) # Get credential

    # If credential is blank, don't even check
    if [ "$credential" = "" ];then
        continue
    fi

    for file in $fileList; do
        auditResult=$(cat --number $file | grep "$credential")
        if [ "$auditResult" != "" ];then
            echo "Credential leak in $file"
            returnVal=1

            # Remove credential to prevent leak in CI run log
            echo "Line"$(sed "s#$credential#<Credential Hidden>#g" <<< $auditResult) 
        fi
    done
done

# Exit with returnVal
exit $returnVal
