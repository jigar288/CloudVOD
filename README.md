# CloudVOD

[![CI](https://github.com/jigar288/CloudVOD/workflows/CI/badge.svg)](https://github.com/jigar288/CloudVOD/actions?query=workflow%3ACI)

## Azure Architecture 

This is the cloud architecture diagram that we customized ourselves for the CloudVOD platform

![CloudVOD Arch](resources/azure-cloud-vod-architecture-diagram.png)

## Encoding Workflow

This diagram details the process of uploading, encoding, and monitoring

![Encoding Workflow](resources/encoding-workflow.svg)

## How to run & test

1. Create a Microsoft Azure Account & create the Azure Media Service resource via setup wizard
2. Run `npm install` in root dir
3. Create a `.env` file based on `.env.example` in repo & replace values with azure account info
4. Run `npm run watch` in root dir
5. Go to `http://localhost:5000/api/az/file-uploader` in a web browser and upload a video file 

