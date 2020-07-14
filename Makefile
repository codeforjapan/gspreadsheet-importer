include .env

push:
	clasp push
	clasp deploy -i ${DEPLOYMENT_ID}