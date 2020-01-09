#! /usr/bin/env bash

find dist -type f \( -name "*.js" -o -name "*.css" -o -name "*.css.map" -o -name "index.html" \) -print0 | xargs -0 sed -i "s/[[:space:]]*$//"
