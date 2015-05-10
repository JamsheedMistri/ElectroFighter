#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
APP_FILE="$DIR/src/Application.js"
EXAMPLE_DIR="$DIR/modules/devkit-scene/examples"

# Check args
if [ $# -eq 0 ]; then
  echo "Usage: set-example.sh <example-name>"
  exit 1
fi

# Check for a non-link file
if [ -f "$APP_FILE" ] && [ ! -L "$APP_FILE" ]; then
  echo "Regular file found at $APP_FILE"
  echo "Please store this file somewhere safe, and then try running again"
  exit 2
fi

# Check for old link
if [ -L "$APP_FILE" ]; then
  echo "Old app link exists, removing"
  rm $APP_FILE
fi

# Check the specified example exists
NEW_EXAMPLE="$EXAMPLE_DIR/$1.js"
if [ ! -f "$NEW_EXAMPLE" ]; then
  echo "Could not find example at: $NEW_EXAMPLE"
  echo "Try one of these:" `ls $EXAMPLE_DIR | sed -e 's/\..*$//' | xargs`
  exit 3
fi

# Make the new link
(
  echo "Creating new link"
  cd $DIR/src
  ln -s $NEW_EXAMPLE Application.js
)
echo "Done!"
