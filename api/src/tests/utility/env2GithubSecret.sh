#!/bin/bash
# Convert local env file to github secret format
cat .env | \
sed "s#AadClientId#AADCLIENTID#g" | \
sed "s#AadSecret#AADSECRET#g" | \
sed "s#AadTenantDomain#AADTENANTDOMAIN#g" | \
sed "s#AadTenantId#AADTENANTID#g" | \
sed "s#AccountName#ACCOUNTNAME#g" | \
sed "s#Location#LOCATION#g" | \
sed "s#ResourceGroup#RESOURCEGROUP#g" | \
sed "s#SubscriptionId#SUBSCRIPTIONID#g" | \
sed "s#StorageConnection#STORAGECONNECTION#g" | \
sed "s#TransformName#TRANSFORMNAME#g"