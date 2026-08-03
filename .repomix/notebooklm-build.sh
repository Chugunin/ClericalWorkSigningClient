#!/bin/bash
set -e
for c in architecture frontend server shared config
do
  echo "Building $c..."
  repomix -c ".repomix/$c.json"
done
echo "Done."
