#!/bin/bash

result=`clasp run getInitialDriveID`;
echo "$result";
echo "$result" | while read line; do
  lastline="$line"
  if [[ $lastline =~ https ]]; then
    echo "open URL."
    # somehow this line doesn't work on my environment. (OSX 10.15.5 (19F101) and Terminal)
    python -m webbrowser $lastline
  fi
done
