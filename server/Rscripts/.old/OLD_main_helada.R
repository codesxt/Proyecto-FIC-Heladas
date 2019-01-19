####################################Rutas###################################################

ruta_modelos<-"modelos/" #Aquí colocar ruta de la carpeta que contiene los modelos de prediccion
ruta_funciones<-"funciones_prediccion_helada_new.R" #Aquí colocar ruta del archivo funciones_prediccion_helada.R
#ruta_datos_coneccion<-"datos_coneccion.csv" ##Aquí colocar del archivo datos_coneccion.csv
##################################################################################################

# Suprimiendo los warning messages

options(warn = -1)

################################Se cargan los paquetes##############################################
#Paquete RandomForest
library(randomForest)
#Paquete Postgre SQL
#library(RPostgreSQL)
#Paquete de XML
#library(XML)

#Se cargan las funciones de prediccion de heladas
source(ruta_funciones)


####################################################################################################

###############################Parametros###########################################################
#Se leen los parametros
parametros<-commandArgs(trailingOnly = FALSE)

Fecha<-as.Date(parametros[6])
cat("\nLa fecha evaluada es: ", as.character(Fecha), "\n")

ema_ia_id<-as.numeric(parametros[7])

cat("El id de la EMA es: ", ema_ia_id, "\n")

variable_control_horas<-as.numeric(parametros[8]) - 3 # (15- 3 = 12 / 18 -3 = 15 / 21-3= 18)

cat("La hora para la prediccion es: ", parametros[8], "\n")

#Nombre archivo para descargar
nombre_archivo<-paste0(ema_ia_id,'.csv')
####################################################################################################

##################################Codigo principal##################################################

#procesamiento datos

#Se ven los errores con try y catch
print("Revisando la ejecución del script con try y catch")
result<-try(salida<-main_prediccion_helada(), silent = TRUE)

if(class(result) != "try-error"){
  print("Ejecutando de forma correcta el script")

}else{
  cat("\nError en la ejecución del script:\n\n")
  salida<-3
  print(result)
  cat("\n\n")
}

unlink(nombre_archivo)

cat("\n\nFin ejecucion script\n\n")
###############################################################################################################################################################
