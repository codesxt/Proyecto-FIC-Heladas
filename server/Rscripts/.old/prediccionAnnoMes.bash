#!/bin/bash

# $1 -> año
# $2 -> mes
# script año mes

Y=$1
M=$2

# calcula cantidad de días de un mes de un año.
DIAS=$(cal $M $Y | awk 'NF {DAYS = $NF}; END {print DAYS}')

# por cada día.
for dia in $(seq 1 $DIAS)
do
  # en cada período de ese día.
  for hora in 15 18 21
  do
    # por cada estación.
    
    for estacion in 58 60 62 63 74 76 77 79 82 83 92 94 95 97 98 100 101 105 229 291
    do
      echo "Predicción: $Y-$M-$dia Estación: $estacion Hora: $hora ..."
      PREDICCION=$(Rscript /home/rahumada/scripts/main_helada2.R $Y-$M-$dia $estacion $hora)
    done
  done
done
