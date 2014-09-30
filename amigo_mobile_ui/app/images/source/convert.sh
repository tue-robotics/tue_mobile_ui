#!/bin/bash



#favicon
inkscape \
	--export-width=32 \
	--export-png=temp.png \
	icon-amigo.svg
convert -verbose temp.png -alpha off -colors 256 ../favicon-amigo.ico
rm -v temp.png
inkscape \
	--export-width=32 \
	--export-png=temp.png \
	icon-sergio.svg
convert -verbose temp.png -alpha off -colors 256 ../favicon-sergio.ico
rm -v temp.png

#apple-touch-icon
inkscape \
	--export-png=../apple-touch-icon-precomposed-amigo.png \
	icon-amigo.svg
inkscape \
	--export-png=../apple-touch-icon-precomposed-sergio.png \
	icon-sergio.svg

#tile
inkscape \
	--export-width=558 \
	--export-png=../tile-amigo.png \
	icon-amigo.svg
inkscape \
	--export-width=558 \
	--export-png=../tile-sergio.png \
	icon-sergio.svg

#tile-wide
inkscape \
	--export-width=558 --export-area=-76:0:228:152 --export-background=white \
	--export-png=../tile-wide-amigo.png \
	icon-amigo.svg
inkscape \
	--export-width=558 --export-area=-76:0:228:152 --export-background=white \
	--export-png=../tile-wide-sergio.png \
	icon-sergio.svg

#startup
inkscape \
	--export-png=../startup-amigo.png \
	startup-amigo.svg
inkscape \
	--export-png=../startup-sergio.png \
	startup-sergio.svg

exit

#optimise images
optipng -zc1-9 -zm8-9 -zs0-3 -f0-5 ../*.png
advpng -z4 ../*.png