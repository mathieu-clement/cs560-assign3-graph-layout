#!/bin/sh

for f in $(dirname "$0")/facebook/*.edges; do
    cat $f | tr ' ' ',' > $f.csv
done
