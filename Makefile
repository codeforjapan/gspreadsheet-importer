include .env

push:
	clasp push
	clasp deploy -i ${DEPLOYMENT_ID}

open_drive:  # this command didn't work on my PC so far...
	@echo  "# Retrieve initial drive id"
	./open_drive.sh
