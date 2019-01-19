#!/usr/bin/env Rscript
library(jsonlite)
######### Cómo ejecutar #############################
# Para ejecutar el código debe usarse la siguiente sintaxis
# Rscript main.R date dataFile frostModel durationModel intensityModel hourModel hour
# Donde los parámetros corresponden a:
#   date           : Fecha en la que se está haciendo la predicción
#   dataFile       : El archivo csv que contiene los datos
#   frostModel     : El archivo .RData con el modelo de predicción de heladas
#   durationModel  : El archivo .RData con el modelo de predicción de duración
#   intensityModel : El archivo .RData con el modelo de predicción de duración
#   hourModel      : El archivo .RData con el modelo de predicción de hora de ocurrencia
#   hour           : La hora en la que se está haciendo la predicción
# Un ejemplo de ejecución sería:
# Rscript main.R 2018-06-03 L6.csv 124_21.RData Duracion_Cunco_21.RData Intensidad_Cunco_21.RData Hora_Cunco_21.RData 21
####################################Rutas###################################################
modelFilesPath <- "../model-files/"
dataFilesPath  <- "../data-files/"
funciones      <- "./funciones_prediccion.R"
################################Se cargan los paquetes##############################################
suppressMessages(library(randomForest))
source(funciones)
###############################Parametros###########################################################
#Se leen los parametros
parametros     <- commandArgs(trailingOnly = TRUE)
Fecha          <- as.Date(parametros[1])
dataFile       <- as.character(parametros[2])
frostModel     <- as.character(parametros[3])
intensityModel <- as.character(parametros[4])
durationModel  <- as.character(parametros[5])
hourModel      <- as.character(parametros[6])
control_horas  <- as.numeric(parametros[7])-3 # (15- 3 = 12 / 18 -3 = 15 / 21-3= 18)
####################################################################################################

##################################Código principal##################################################
result <- try(
  salida <- prediccion_helada(frostModel, durationModel, intensityModel, hourModel)
)

if(class(result) != "try-error"){
  json = toJSON(salida, pretty = TRUE, auto_unbox = TRUE)
  print(json)
}else{
  #print("Error en la ejecución del script:")
  print(result)
  salida <- list(
    'frost'     = NA,
    'duration'  = NA,
    'intensity' = NA,
    'hour'      = NA
  )
  json = toJSON(salida, pretty = TRUE, auto_unbox = TRUE)
  print(json)
}
