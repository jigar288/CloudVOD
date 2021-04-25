#!/bin/bash
if [ "$(which act)" = "" ];then
    curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
fi
if [ "$1" != "" ];then
    extraArg=" --job $1"
fi

api/src/tests/utility/env2GithubSecret.sh > .secret
act --secret-file .secret $extraArg
rm .secret


